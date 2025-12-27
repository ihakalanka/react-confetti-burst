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
 */
import { createParticle, updateParticle, renderParticle, areAllParticlesInactive, countActiveParticles, } from './particle';
import { mergeConfig, getDirectionAngle, randomInRange, degToRad, createDeferred, isBrowser, getDevicePixelRatio, secureRandom, } from './utils';
import { PERFORMANCE, CLEANUP_DELAY, MATH_CONSTANTS, DEFAULT_CONTINUOUS, DEFAULT_FIREWORK, DEFAULT_CANVAS, } from './constants';
/**
 * Global canvas element for reuse
 */
let globalCanvas = null;
let globalCtx = null;
let activeAnimations = 0;
let resizeHandler = null;
/**
 * Creates or gets the shared canvas element
 */
function getOrCreateCanvas(zIndex, canvasConfig) {
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
        globalCtx.scale(dpr, dpr);
    }
    return {
        canvas: globalCanvas,
        ctx: globalCtx,
        width,
        height,
        dpr,
    };
}
/**
 * Cleans up the canvas when no animations are running
 */
function cleanupCanvas() {
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
function getSpawnPoint(area, _canvasWidth, _canvasHeight) {
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
    constructor(origin, options) {
        this.particles = [];
        this.canvasContext = null;
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.lastSpawnTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.deferred = createDeferred();
        this.frameInterval = 0;
        this.lastRenderTime = 0;
        /**
         * Main animation loop
         */
        this.animate = () => {
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
            // Clear canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width * dpr, height * dpr);
            ctx.scale(dpr, dpr);
            // Update and render particles
            const { physics, particle } = this.config;
            for (const p of this.particles) {
                if (p.active) {
                    updateParticle(p, deltaTime, physics, particle.fadeOut, particle.scaleDown);
                    // Check for firework rocket reaching target
                    if (p.data?.isRocket && p.y <= p.data.targetY) {
                        p.active = false;
                        this.explodeFirework(p.x, p.y, p.data);
                    }
                    // Check for secondary explosions (low velocity means particle is falling)
                    const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    if (p.data?.willExplode && !p.data.hasExploded && velocity < 1) {
                        p.data.hasExploded = true;
                        this.explodeFirework(p.x, p.y, { burstCount: 15, spread: 360, burstColors: p.data.burstColors });
                    }
                    renderParticle(ctx, p, { customDraw: this.drawShape });
                }
            }
            // Handle continuous mode spawning and recycling
            if (this.mode === 'continuous' || this.mode === 'snow' || this.mode === 'rain') {
                const timeSinceLastSpawn = currentTime - this.lastSpawnTime;
                const spawnInterval = 1000 / (this.continuousConfig.spawnRate ?? 10);
                if (timeSinceLastSpawn >= spawnInterval) {
                    const activeCount = countActiveParticles(this.particles);
                    if (this.continuousConfig.recycle) {
                        // Recycle dead particles
                        const deadParticles = this.particles.filter(p => !p.active);
                        const toRecycle = Math.min(deadParticles.length, this.continuousConfig.numberOfPieces - activeCount);
                        if (toRecycle > 0) {
                            // Remove old dead particles and spawn new ones
                            this.particles = this.particles.filter(p => p.active);
                            this.spawnParticles(toRecycle);
                        }
                    }
                    else if (activeCount < this.continuousConfig.numberOfPieces) {
                        // Just spawn more if under limit
                        this.spawnParticles(Math.min(3, this.continuousConfig.numberOfPieces - activeCount));
                    }
                    this.lastSpawnTime = currentTime;
                }
            }
            // Handle firework mode - launch new fireworks
            if (this.mode === 'firework') {
                const activeRockets = this.particles.filter(p => p.active && p.data?.isRocket).length;
                const timeSinceLastSpawn = currentTime - this.lastSpawnTime;
                if (activeRockets === 0 && timeSinceLastSpawn >= (this.fireworkConfig.burstDelay ?? 500)) {
                    this.launchFirework();
                    this.lastSpawnTime = currentTime;
                }
            }
            // Check if animation is complete (not for continuous/infinite modes)
            if (this.mode === 'burst' || this.mode === 'cannon' || this.mode === 'explosion') {
                if (areAllParticlesInactive(this.particles)) {
                    this.complete();
                    return;
                }
            }
            // Continue animation
            this.animationFrameId = requestAnimationFrame(this.animate);
        };
        this.origin = origin;
        this.config = mergeConfig(options);
        // Set up mode-specific configuration
        this.mode = options?.mode ?? 'burst';
        this.spawnArea = options?.spawnArea;
        this.continuousConfig = { ...DEFAULT_CONTINUOUS, ...options?.continuous };
        this.fireworkConfig = { ...DEFAULT_FIREWORK, ...options?.firework };
        this.canvasConfig = { ...DEFAULT_CANVAS, ...options?.canvas };
        this.drawShape = options?.particle?.drawShape;
        // Frame rate control
        if (this.canvasConfig.frameRate) {
            this.frameInterval = 1000 / this.canvasConfig.frameRate;
        }
    }
    /**
     * Starts the confetti animation
     */
    start() {
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
            const initialCount = Math.min(this.continuousConfig.numberOfPieces, Math.floor(this.continuousConfig.numberOfPieces * 0.5));
            this.spawnParticles(initialCount);
        }
        else if (this.mode === 'firework') {
            // For firework, launch the first firework
            this.launchFirework();
        }
        else {
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
    createParticles() {
        const { particleCount, particle, direction, physics } = this.config;
        const { x, y } = this.origin;
        // Limit particles for performance
        const count = Math.min(particleCount, PERFORMANCE.MAX_PARTICLES);
        for (let i = 0; i < count; i++) {
            // Calculate direction angle with spread
            let angle;
            if (direction.direction === 'radial') {
                // Full 360° spread for radial
                angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
            }
            else {
                // Directional burst with spread
                const baseAngle = getDirectionAngle(direction.direction, direction.angle);
                const spreadRad = degToRad(direction.spread);
                angle = baseAngle + (secureRandom() - 0.5) * spreadRad;
            }
            // Random velocity within range
            const velocity = randomInRange(direction.velocity[0], direction.velocity[1]);
            const newParticle = createParticle(x, y, angle, velocity, particle.colors, particle.shapes, particle.size, particle.opacity, particle.lifespan, physics.rotationSpeed, {
                images: particle.images,
                tiltRange: particle.tilt,
                spinSpeedRange: particle.spinSpeed,
                depth3D: particle.depth3D,
            });
            this.particles.push(newParticle);
        }
    }
    /**
     * Spawns particles for continuous mode
     */
    spawnParticles(count) {
        if (!this.canvasContext)
            return;
        const { particle, physics } = this.config;
        const { width, height } = this.canvasContext;
        for (let i = 0; i < count; i++) {
            // Get spawn position
            let spawnPoint;
            if (this.spawnArea) {
                spawnPoint = getSpawnPoint(this.spawnArea, width, height);
            }
            else if (this.mode === 'snow' || this.mode === 'rain') {
                // Spawn from top of screen
                spawnPoint = { x: randomInRange(0, width), y: -20 };
            }
            else {
                // Default to top center area
                spawnPoint = { x: randomInRange(0, width), y: randomInRange(-20, 0) };
            }
            // Calculate angle based on mode
            let angle;
            let velocity;
            if (this.mode === 'snow') {
                angle = degToRad(randomInRange(-20, 20) - 90); // Mostly down with some drift
                velocity = randomInRange(0.5, 2);
            }
            else if (this.mode === 'rain') {
                angle = degToRad(-90); // Straight down
                velocity = randomInRange(8, 15);
            }
            else {
                angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
                velocity = randomInRange(2, 6);
            }
            const newParticle = createParticle(spawnPoint.x, spawnPoint.y, angle, velocity, particle.colors, particle.shapes, particle.size, particle.opacity, particle.lifespan, physics.rotationSpeed, {
                images: particle.images,
                tiltRange: particle.tilt,
                spinSpeedRange: particle.spinSpeed,
                depth3D: particle.depth3D,
            });
            this.particles.push(newParticle);
        }
    }
    /**
     * Launches a firework
     */
    launchFirework() {
        if (!this.canvasContext)
            return;
        const { width, height } = this.canvasContext;
        const { launchHeight, burstCount, spread, secondaryExplosions, rocketColors, burstColors, trailLength } = this.fireworkConfig;
        // Launch point at bottom of screen
        const launchX = this.spawnArea
            ? getSpawnPoint(this.spawnArea, width, height).x
            : randomInRange(width * 0.2, width * 0.8);
        // Target explosion point
        const targetY = height * (1 - launchHeight);
        const targetX = launchX + randomInRange(-50, 50);
        // Create rocket particle (goes up, then triggers explosion)
        const rocketParticle = createParticle(launchX, height, degToRad(-90 + randomInRange(-10, 10)), randomInRange(15, 25), rocketColors, ['circle'], [3, 5], [1, 1], 2000, 0);
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
    explodeFirework(x, y, data) {
        const { burstCount = 80, spread = 360, burstColors, secondaryExplosions } = data;
        const colors = burstColors ?? this.config.particle.colors;
        // Create burst particles
        const spreadRad = degToRad(spread);
        for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * spreadRad - spreadRad / 2 + degToRad(-90);
            const velocity = randomInRange(4, 12);
            const burstParticle = createParticle(x, y, angle, velocity, colors, this.config.particle.shapes, [2, 6], [0.8, 1], 1500, this.config.physics.rotationSpeed);
            // Mark for secondary explosion
            if (secondaryExplosions && secureRandom() < 0.1) {
                burstParticle.data = { willExplode: true, burstColors: colors };
            }
            this.particles.push(burstParticle);
        }
    }
    /**
     * Stops the animation immediately
     */
    stop() {
        if (!this.isRunning)
            return;
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
    pause() {
        this.isPaused = true;
    }
    /**
     * Resumes a paused animation
     */
    resume() {
        this.isPaused = false;
    }
    /**
     * Called when animation completes naturally
     */
    complete() {
        this.config.onComplete?.();
        this.cleanup();
        this.deferred.resolve();
    }
    /**
     * Cleans up resources
     */
    cleanup() {
        this.isRunning = false;
        this.isPaused = false;
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
    addParticles(count) {
        if (!this.isRunning || !this.canvasContext)
            return;
        if (this.mode === 'continuous' || this.mode === 'snow' || this.mode === 'rain') {
            this.spawnParticles(count);
        }
        else {
            // For burst mode, create from original origin
            const { particle, direction, physics } = this.config;
            const { x, y } = this.origin;
            for (let i = 0; i < count; i++) {
                let angle;
                if (direction.direction === 'radial') {
                    angle = secureRandom() * MATH_CONSTANTS.TWO_PI;
                }
                else {
                    const baseAngle = getDirectionAngle(direction.direction, direction.angle);
                    const spreadRad = degToRad(direction.spread);
                    angle = baseAngle + (secureRandom() - 0.5) * spreadRad;
                }
                const velocity = randomInRange(direction.velocity[0], direction.velocity[1]);
                const newParticle = createParticle(x, y, angle, velocity, particle.colors, particle.shapes, particle.size, particle.opacity, particle.lifespan, physics.rotationSpeed);
                this.particles.push(newParticle);
            }
        }
    }
    /**
     * Clears all particles
     */
    clear() {
        this.particles = [];
    }
    /**
     * Gets current particle count
     */
    getParticleCount() {
        return countActiveParticles(this.particles);
    }
    /**
     * Gets the current state
     */
    getState() {
        if (!this.isRunning)
            return 'stopped';
        if (this.isPaused)
            return 'paused';
        return 'running';
    }
    /**
     * Creates the explosion handle for external control
     */
    createHandle() {
        return {
            stop: () => this.stop(),
            pause: () => this.pause(),
            resume: () => this.resume(),
            promise: this.deferred.promise,
            addParticles: (count) => this.addParticles(count),
            clear: () => this.clear(),
            getParticleCount: () => this.getParticleCount(),
            getState: () => this.getState(),
        };
    }
}
/**
 * Creates and starts a confetti explosion
 */
export function createConfettiExplosion(origin, options) {
    const engine = new ConfettiEngine(origin, options);
    return engine.start();
}
/**
 * Fires confetti from an element's center
 */
export function fireFromElement(element, options) {
    if (!element || !isBrowser()) {
        return null;
    }
    const rect = element.getBoundingClientRect();
    const origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
    return createConfettiExplosion(origin, options);
}
/**
 * Gets the current number of active animations
 */
export function getActiveAnimationCount() {
    return activeAnimations;
}
/**
 * Forces cleanup of all resources
 */
export function forceCleanup() {
    if (globalCanvas) {
        globalCanvas.remove();
        globalCanvas = null;
        globalCtx = null;
    }
    activeAnimations = 0;
}
//# sourceMappingURL=confetti-engine.js.map