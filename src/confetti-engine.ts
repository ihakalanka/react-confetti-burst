/**
 * Confetti Engine - Core Canvas-based animation system
 * 
 * This module provides the main confetti animation engine that manages
 * particle creation, physics updates, and rendering using the Canvas API.
 * 
 * Features:
 * - High-performance requestAnimationFrame loop
 * - Automatic DPR (Device Pixel Ratio) handling
 * - Directional burst support
 * - Continuous/recycle mode (like react-confetti)
 * - Firework mode with secondary explosions
 * - Spawn area support
 * - Memory-efficient particle pooling
 * - Automatic cleanup
 * 
 * Optimizations:
 * - Object pooling to minimize GC pressure
 * - Spatial culling for off-screen particles
 * - Batched rendering operations
 * - Pre-computed trigonometric values
 * - Optimized hot path with for loops
 */

import type {
  ConfettiBurstConfig,
  ConfettiBurstOptions,
  BurstOrigin,
  ParticleState,
  CanvasContext,
  ExplosionHandle,
  EffectMode,
  SpawnArea,
  ContinuousConfig,
  FireworkConfig,
  CanvasConfig,
  CustomDrawFunction,
} from './types';

import {
  createParticle,
  updateParticle,
  renderParticle,
  countActiveParticles,
} from './particle';

import {
  mergeConfig,
  getDirectionAngle,
  randomInRange,
  degToRad,
  createDeferred,
  isBrowser,
  getDevicePixelRatio,
  secureRandom,
} from './utils';

import {
  PERFORMANCE,
  CLEANUP_DELAY,
  MATH_CONSTANTS,
  DEFAULT_CONTINUOUS,
  DEFAULT_FIREWORK,
  DEFAULT_CANVAS,
} from './constants';

/**
 * Global canvas element for reuse
 */
let globalCanvas: HTMLCanvasElement | null = null;
let globalCtx: CanvasRenderingContext2D | null = null;
let activeAnimations = 0;
let resizeHandler: (() => void) | null = null;

/**
 * ==========================================
 * OPTIMIZATION: Object Pool for Particles
 * ==========================================
 * Reuses particle objects to minimize garbage collection
 */
const particlePool: ParticleState[] = [];
const MAX_POOL_SIZE = 500;

/**
 * Get a particle from the pool (for future use)
 */
export function getPooledParticle(): ParticleState | null {
  return particlePool.pop() || null;
}

function returnToPool(particle: ParticleState): void {
  if (particlePool.length < MAX_POOL_SIZE) {
    // Reset critical properties
    particle.active = false;
    particle.trail.length = 0;
    particlePool.push(particle);
  }
}

/**
 * ==========================================
 * OPTIMIZATION: Pre-computed angle lookup
 * ==========================================
 */
const ANGLE_CACHE_SIZE = 360;
const SIN_CACHE = new Float32Array(ANGLE_CACHE_SIZE);
const COS_CACHE = new Float32Array(ANGLE_CACHE_SIZE);

// Initialize angle cache
for (let i = 0; i < ANGLE_CACHE_SIZE; i++) {
  const rad = (i * Math.PI) / 180;
  SIN_CACHE[i] = Math.sin(rad);
  COS_CACHE[i] = Math.cos(rad);
}

/**
 * Fast sine lookup for integer degrees
 */
export function fastSin(degrees: number): number {
  const idx = ((degrees % 360) + 360) % 360;
  return SIN_CACHE[Math.floor(idx)];
}

/**
 * Fast cosine lookup for integer degrees
 */
export function fastCos(degrees: number): number {
  const idx = ((degrees % 360) + 360) % 360;
  return COS_CACHE[Math.floor(idx)];
}

/**
 * Creates or gets the shared canvas element
 */
function getOrCreateCanvas(zIndex: number, canvasConfig?: Partial<CanvasConfig>): CanvasContext {
  if (!isBrowser()) {
    throw new Error('ConfettiEngine requires a browser environment');
  }

  const config = { ...DEFAULT_CANVAS, ...canvasConfig };
  const dpr = config.pixelRatio ?? getDevicePixelRatio(PERFORMANCE.MAX_DPR);

  if (!globalCanvas) {
    globalCanvas = document.createElement('canvas');
    globalCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${zIndex};
    `;
    
    globalCtx = globalCanvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Hint for better performance
    });

    if (!globalCtx) {
      throw new Error('Failed to get canvas 2D context');
    }

    document.body.appendChild(globalCanvas);

    // Set up auto-resize handler
    if (config.autoResize) {
      resizeHandler = () => {
        if (globalCanvas && globalCtx) {
          const width = config.width ?? window.innerWidth;
          const height = config.height ?? window.innerHeight;
          globalCanvas.width = width * dpr;
          globalCanvas.height = height * dpr;
          globalCanvas.style.width = `${width}px`;
          globalCanvas.style.height = `${height}px`;
          globalCtx.scale(dpr, dpr);
        }
      };
      window.addEventListener('resize', resizeHandler);
    }
  }

  // Update z-index if different
  globalCanvas.style.zIndex = String(zIndex);

  // Resize canvas to match viewport or specified dimensions
  const width = config.width ?? window.innerWidth;
  const height = config.height ?? window.innerHeight;

  if (globalCanvas.width !== width * dpr || globalCanvas.height !== height * dpr) {
    globalCanvas.width = width * dpr;
    globalCanvas.height = height * dpr;
    globalCanvas.style.width = `${width}px`;
    globalCanvas.style.height = `${height}px`;
    globalCtx!.scale(dpr, dpr);
  }

  return {
    canvas: globalCanvas,
    ctx: globalCtx!,
    width,
    height,
    dpr,
  };
}

/**
 * Cleans up the canvas when no animations are running
 */
function cleanupCanvas(): void {
  if (globalCanvas && activeAnimations === 0) {
    setTimeout(() => {
      if (activeAnimations === 0 && globalCanvas) {
        if (resizeHandler) {
          window.removeEventListener('resize', resizeHandler);
          resizeHandler = null;
        }
        globalCanvas.remove();
        globalCanvas = null;
        globalCtx = null;
      }
    }, CLEANUP_DELAY);
  }
}

/**
 * Gets a random point within a spawn area
 */
function getSpawnPoint(area: SpawnArea, _canvasWidth: number, _canvasHeight: number): BurstOrigin {
  const { type, x, y, w, h } = area;
  
  switch (type) {
    case 'point':
      return { x, y };
    case 'rect':
      return {
        x: randomInRange(x, x + (w ?? 0)),
        y: randomInRange(y, y + (h ?? 0)),
      };
    case 'line':
      const t = secureRandom();
      return {
        x: x + t * (w ?? 0),
        y: y + t * (h ?? 0),
      };
    case 'circle':
      const angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
      const radius = Math.sqrt(secureRandom()) * (w ?? 50); // sqrt for uniform distribution
      return {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
      };
    default:
      return { x, y };
  }
}

/**
 * Main confetti engine class
 */
export class ConfettiEngine {
  private particles: ParticleState[] = [];
  private config: ConfettiBurstConfig;
  private origin: BurstOrigin;
  private canvasContext: CanvasContext | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private lastSpawnTime: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private deferred = createDeferred<void>();
  
  // New properties for advanced modes
  private mode: EffectMode;
  private spawnArea?: SpawnArea;
  private continuousConfig: ContinuousConfig;
  private fireworkConfig: FireworkConfig;
  private canvasConfig: CanvasConfig;
  private drawShape?: CustomDrawFunction;
  private frameInterval: number = 0;
  private lastRenderTime: number = 0;

  constructor(origin: BurstOrigin, options?: ConfettiBurstOptions) {
    this.origin = origin;
    this.config = mergeConfig(options);
    
    // Set up mode-specific configuration
    this.mode = (options as any)?.mode ?? 'burst';
    this.spawnArea = (options as any)?.spawnArea;
    this.continuousConfig = { ...DEFAULT_CONTINUOUS, ...(options as any)?.continuous };
    this.fireworkConfig = { ...DEFAULT_FIREWORK, ...(options as any)?.firework };
    this.canvasConfig = { ...DEFAULT_CANVAS, ...(options as any)?.canvas };
    this.drawShape = (options as any)?.particle?.drawShape;
    
    // Frame rate control
    if (this.canvasConfig.frameRate) {
      this.frameInterval = 1000 / this.canvasConfig.frameRate;
    }
  }

  /**
   * Starts the confetti animation
   */
  start(): ExplosionHandle {
    if (this.isRunning) {
      return this.createHandle();
    }

    if (!isBrowser()) {
      console.warn('ConfettiEngine: Cannot start animation in non-browser environment');
      this.deferred.resolve();
      return this.createHandle();
    }

    this.isRunning = true;
    activeAnimations++;

    // Get or create canvas
    this.canvasContext = getOrCreateCanvas(this.config.zIndex, this.canvasConfig);

    // Create initial particles based on mode
    if (this.mode === 'continuous' || this.mode === 'snow' || this.mode === 'rain') {
      // For continuous modes, spawn initial batch
      const initialCount = Math.min(
        this.continuousConfig.numberOfPieces,
        Math.floor(this.continuousConfig.numberOfPieces * 0.5)
      );
      this.spawnParticles(initialCount);
    } else if (this.mode === 'firework') {
      // For firework, launch the first firework
      this.launchFirework();
    } else {
      // Standard burst mode
      this.createParticles();
    }

    // Fire onStart callback
    this.config.onStart?.();

    // Start animation loop
    this.lastFrameTime = performance.now();
    this.lastSpawnTime = performance.now();
    this.lastRenderTime = performance.now();
    this.animate();

    return this.createHandle();
  }

  /**
   * Creates particles for the burst
   */
  private createParticles(): void {
    const { particleCount, particle, direction, physics } = this.config;
    const { x, y } = this.origin;

    // Limit particles for performance
    const count = Math.min(particleCount, PERFORMANCE.MAX_PARTICLES);

    for (let i = 0; i < count; i++) {
      // Calculate direction angle with spread
      let angle: number;

      if (direction.direction === 'radial') {
        // Full 360° spread for radial
        angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
      } else {
        // Directional burst with spread
        const baseAngle = getDirectionAngle(direction.direction, direction.angle);
        const spreadRad = degToRad(direction.spread);
        angle = baseAngle + (secureRandom() - 0.5) * spreadRad;
      }

      // Random velocity within range
      const velocity = randomInRange(direction.velocity[0], direction.velocity[1]);

      const newParticle = createParticle(
        x,
        y,
        angle,
        velocity,
        particle.colors,
        particle.shapes,
        particle.size,
        particle.opacity,
        particle.lifespan,
        physics.rotationSpeed,
        {
          images: particle.images,
          tiltRange: particle.tilt,
          spinSpeedRange: particle.spinSpeed,
          depth3D: particle.depth3D,
        }
      );

      this.particles.push(newParticle);
    }
  }

  /**
   * Spawns particles for continuous mode
   */
  private spawnParticles(count: number): void {
    if (!this.canvasContext) return;

    const { particle, physics } = this.config;
    const { width, height } = this.canvasContext;

    for (let i = 0; i < count; i++) {
      // Get spawn position
      let spawnPoint: BurstOrigin;
      
      if (this.spawnArea) {
        spawnPoint = getSpawnPoint(this.spawnArea, width, height);
      } else if (this.mode === 'snow' || this.mode === 'rain') {
        // Spawn from top of screen
        spawnPoint = { x: randomInRange(0, width), y: -20 };
      } else {
        // Default to top center area
        spawnPoint = { x: randomInRange(0, width), y: randomInRange(-20, 0) };
      }

      // Calculate angle based on mode
      let angle: number;
      let velocity: number;

      if (this.mode === 'snow') {
        angle = degToRad(randomInRange(-20, 20) - 90); // Mostly down with some drift
        velocity = randomInRange(0.5, 2);
      } else if (this.mode === 'rain') {
        angle = degToRad(-90); // Straight down
        velocity = randomInRange(8, 15);
      } else {
        angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
        velocity = randomInRange(2, 6);
      }

      const newParticle = createParticle(
        spawnPoint.x,
        spawnPoint.y,
        angle,
        velocity,
        particle.colors,
        particle.shapes,
        particle.size,
        particle.opacity,
        particle.lifespan,
        physics.rotationSpeed,
        {
          images: particle.images,
          tiltRange: particle.tilt,
          spinSpeedRange: particle.spinSpeed,
          depth3D: particle.depth3D,
        }
      );

      this.particles.push(newParticle);
    }
  }

  /**
   * Launches a firework
   */
  private launchFirework(): void {
    if (!this.canvasContext) return;

    const { width, height } = this.canvasContext;
    const { launchHeight, burstCount, spread, secondaryExplosions, rocketColors, burstColors, trailLength } = this.fireworkConfig;

    // Launch point at bottom of screen
    const launchX = this.spawnArea 
      ? getSpawnPoint(this.spawnArea, width, height).x
      : randomInRange(width * 0.2, width * 0.8);
    
    // Target explosion point
    const targetY = height * (1 - launchHeight!);
    const targetX = launchX + randomInRange(-50, 50);

    // Create rocket particle (goes up, then triggers explosion)
    const rocketParticle = createParticle(
      launchX,
      height,
      degToRad(-90 + randomInRange(-10, 10)),
      randomInRange(15, 25),
      rocketColors!,
      ['circle'],
      [3, 5],
      [1, 1],
      2000,
      0
    );

    // Mark as firework rocket with target
    rocketParticle.data = {
      isRocket: true,
      targetY,
      targetX,
      burstCount,
      spread,
      burstColors,
      secondaryExplosions,
      trailLength,
    };

    this.particles.push(rocketParticle);
  }

  /**
   * Triggers a firework explosion at a position
   */
  private explodeFirework(x: number, y: number, data: any): void {
    const { burstCount = 80, spread = 360, burstColors, secondaryExplosions } = data;
    const colors = burstColors ?? this.config.particle.colors;

    // Create burst particles
    const spreadRad = degToRad(spread);
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * spreadRad - spreadRad / 2 + degToRad(-90);
      const velocity = randomInRange(4, 12);

      const burstParticle = createParticle(
        x,
        y,
        angle,
        velocity,
        colors,
        this.config.particle.shapes,
        [2, 6],
        [0.8, 1],
        1500,
        this.config.physics.rotationSpeed
      );

      // Mark for secondary explosion
      if (secondaryExplosions && secureRandom() < 0.1) {
        burstParticle.data = { willExplode: true, burstColors: colors };
      }

      this.particles.push(burstParticle);
    }
  }

  /**
   * Main animation loop - OPTIMIZED
   */
  private animate = (): void => {
    if (!this.isRunning || !this.canvasContext) {
      return;
    }

    // Check if running is disabled in continuous mode
    if ((this.mode === 'continuous' || this.mode === 'snow' || this.mode === 'rain') && 
        !this.continuousConfig.run) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.lastFrameTime = performance.now();
      return;
    }

    if (this.isPaused) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.lastFrameTime = performance.now();
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Frame rate limiting
    if (this.frameInterval > 0) {
      if (currentTime - this.lastRenderTime < this.frameInterval) {
        this.animationFrameId = requestAnimationFrame(this.animate);
        return;
      }
      this.lastRenderTime = currentTime;
    }

    const { ctx, width, height, dpr } = this.canvasContext;
    const { physics, particle } = this.config;

    // Clear canvas - use resetTransform for better performance if available
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.scale(dpr, dpr);

    // OPTIMIZATION: Use indexed for loop instead of for...of
    // OPTIMIZATION: Track active count inline instead of separate function call
    const particles = this.particles;
    const len = particles.length;
    let activeCount = 0;
    let allInactive = true;
    
    // Define culling bounds with margin
    const cullMargin = 100;
    const minX = -cullMargin;
    const maxX = width + cullMargin;
    const minY = -cullMargin;
    const maxY = height + cullMargin;

    // OPTIMIZATION: Single pass for update, cull, and render
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      
      if (!p.active) continue;
      
      // Update physics
      updateParticle(p, deltaTime, physics, particle.fadeOut, particle.scaleDown);
      
      // Check for firework rocket reaching target
      if (p.data?.isRocket && p.y <= (p.data.targetY as number)) {
        p.active = false;
        this.explodeFirework(p.x, p.y, p.data);
        continue;
      }
      
      // Check for secondary explosions
      if (p.data?.willExplode && !p.data.hasExploded) {
        const velocity = p.vx * p.vx + p.vy * p.vy; // Skip sqrt for comparison
        if (velocity < 1) {
          p.data.hasExploded = true;
          this.explodeFirework(p.x, p.y, { burstCount: 15, spread: 360, burstColors: p.data.burstColors });
        }
      }
      
      // OPTIMIZATION: Spatial culling - skip rendering off-screen particles
      if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        // Mark off-screen particles as inactive if they've left the screen
        if (p.y > maxY || p.x < minX - 200 || p.x > maxX + 200) {
          p.active = false;
        }
        continue;
      }
      
      // Render visible particle
      renderParticle(ctx, p, { customDraw: this.drawShape });
      activeCount++;
      allInactive = false;
    }

    // Handle continuous mode spawning and recycling
    if (this.mode === 'continuous' || this.mode === 'snow' || this.mode === 'rain') {
      const timeSinceLastSpawn = currentTime - this.lastSpawnTime;
      const spawnInterval = 1000 / (this.continuousConfig.spawnRate ?? 10);
      
      if (timeSinceLastSpawn >= spawnInterval) {
        if (this.continuousConfig.recycle) {
          // OPTIMIZATION: Recycle in-place instead of filter
          const targetCount = this.continuousConfig.numberOfPieces;
          let toSpawn = targetCount - activeCount;
          
          if (toSpawn > 0) {
            // Return dead particles to pool and spawn new ones
            for (let i = len - 1; i >= 0 && toSpawn > 0; i--) {
              if (!particles[i].active) {
                returnToPool(particles[i]);
                particles.splice(i, 1);
              }
            }
            this.spawnParticles(Math.min(toSpawn, 5));
          }
        } else if (activeCount < this.continuousConfig.numberOfPieces) {
          this.spawnParticles(Math.min(3, this.continuousConfig.numberOfPieces - activeCount));
        }
        
        this.lastSpawnTime = currentTime;
      }
    }

    // Handle firework mode
    if (this.mode === 'firework') {
      let activeRockets = 0;
      for (let i = 0; i < len; i++) {
        if (particles[i].active && particles[i].data?.isRocket) activeRockets++;
      }
      const timeSinceLastSpawn = currentTime - this.lastSpawnTime;
      
      if (activeRockets === 0 && timeSinceLastSpawn >= (this.fireworkConfig.burstDelay ?? 500)) {
        this.launchFirework();
        this.lastSpawnTime = currentTime;
      }
    }

    // Check if animation is complete
    if (this.mode === 'burst' || this.mode === 'cannon' || this.mode === 'explosion') {
      if (allInactive) {
        this.complete();
        return;
      }
    }

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Stops the animation immediately
   */
  stop(): void {
    if (!this.isRunning) return;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.cleanup();
    this.deferred.resolve();
  }

  /**
   * Pauses the animation
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resumes a paused animation
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Called when animation completes naturally
   */
  private complete(): void {
    this.config.onComplete?.();
    this.cleanup();
    this.deferred.resolve();
  }

  /**
   * Cleans up resources - returns particles to pool
   */
  private cleanup(): void {
    this.isRunning = false;
    this.isPaused = false;
    
    // OPTIMIZATION: Return particles to pool for reuse
    const particles = this.particles;
    for (let i = particles.length - 1; i >= 0; i--) {
      returnToPool(particles[i]);
    }
    this.particles = [];
    this.canvasContext = null;

    activeAnimations--;

    if (this.config.autoCleanup) {
      cleanupCanvas();
    }
  }

  /**
   * Adds more particles to the animation
   */
  addParticles(count: number): void {
    if (!this.isRunning || !this.canvasContext) return;
    
    if (this.mode === 'continuous' || this.mode === 'snow' || this.mode === 'rain') {
      this.spawnParticles(count);
    } else {
      // For burst mode, create from original origin
      const { particle, direction, physics } = this.config;
      const { x, y } = this.origin;
      
      for (let i = 0; i < count; i++) {
        let angle: number;
        if (direction.direction === 'radial') {
          angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
        } else {
          const baseAngle = getDirectionAngle(direction.direction, direction.angle);
          const spreadRad = degToRad(direction.spread);
          angle = baseAngle + (secureRandom() - 0.5) * spreadRad;
        }
        
        const velocity = randomInRange(direction.velocity[0], direction.velocity[1]);
        const newParticle = createParticle(
          x, y, angle, velocity,
          particle.colors, particle.shapes,
          particle.size, particle.opacity,
          particle.lifespan, physics.rotationSpeed
        );
        this.particles.push(newParticle);
      }
    }
  }

  /**
   * Clears all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Gets current particle count
   */
  getParticleCount(): number {
    return countActiveParticles(this.particles);
  }

  /**
   * Gets the current state
   */
  getState(): 'running' | 'paused' | 'stopped' {
    if (!this.isRunning) return 'stopped';
    if (this.isPaused) return 'paused';
    return 'running';
  }

  /**
   * Creates the explosion handle for external control
   */
  private createHandle(): ExplosionHandle {
    return {
      stop: () => this.stop(),
      pause: () => this.pause(),
      resume: () => this.resume(),
      promise: this.deferred.promise,
      addParticles: (count: number) => this.addParticles(count),
      clear: () => this.clear(),
      getParticleCount: () => this.getParticleCount(),
      getState: () => this.getState(),
    };
  }
}

/**
 * Creates and starts a confetti explosion
 */
export function createConfettiExplosion(
  origin: BurstOrigin,
  options?: ConfettiBurstOptions
): ExplosionHandle {
  const engine = new ConfettiEngine(origin, options);
  return engine.start();
}

/**
 * Fires confetti from an element's center
 */
export function fireFromElement(
  element: HTMLElement | null,
  options?: ConfettiBurstOptions
): ExplosionHandle | null {
  if (!element || !isBrowser()) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const origin: BurstOrigin = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  return createConfettiExplosion(origin, options);
}

/**
 * Gets the current number of active animations
 */
export function getActiveAnimationCount(): number {
  return activeAnimations;
}

/**
 * Forces cleanup of all resources
 */
export function forceCleanup(): void {
  if (globalCanvas) {
    globalCanvas.remove();
    globalCanvas = null;
    globalCtx = null;
  }
  activeAnimations = 0;
}
