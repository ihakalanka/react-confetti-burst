/**
 * Confetti Container
 * 
 * Manages a single confetti instance on a canvas
 * Implements Facade Pattern for simplified API
 * 
 * @module engine/Container
 */

import type {
  IContainer,
  IContainerOptions,
  IConfettiOptions,
  IParticle,
  IParticleUpdater,
  IParticleTransformValues,
} from './interfaces';
import { Particle, ParticlePool } from './Particle';
import { createDefaultUpdaters, RollUpdater } from './updaters';
import { defaultShapeRegistry } from './shapes';
import {
  generateId,
  calculateDelta,
  requestFrame,
  cancelFrame,
  prefersReducedMotion,
  adjustColorBrightness,
  getPixelRatio,
} from './utils';

/**
 * Container class for managing particle systems
 */
export class Container implements IContainer {
  readonly id: string;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  destroyed = false;

  private readonly _particles: Particle[] = [];
  private readonly _updaters: IParticleUpdater[];
  private readonly _pool: ParticlePool;
  private readonly _options: Required<IContainerOptions>;
  
  private _animationId: number | null = null;
  private _lastTimestamp = 0;
  private _resolvePromise: (() => void) | null = null;
  private _isOwnCanvas = false;
  private _resizeObserver: ResizeObserver | null = null;

  constructor(options: IContainerOptions = {}) {
    this.id = `confetti-${generateId()}`;
    
    // Merge with defaults
    this._options = {
      canvas: options.canvas,
      resize: options.resize ?? true,
      zIndex: options.zIndex ?? 100,
      disableForReducedMotion: options.disableForReducedMotion ?? false,
    } as Required<IContainerOptions>;

    // Create or use provided canvas
    if (options.canvas) {
      this.canvas = options.canvas;
    } else {
      this.canvas = this._createCanvas();
      this._isOwnCanvas = true;
    }

    // Get 2D context with optimizations
    const ctx = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Performance optimization
    });

    if (!ctx) {
      throw new Error('Failed to get 2D canvas context');
    }

    this.ctx = ctx;

    // Initialize components
    this._updaters = createDefaultUpdaters();
    this._pool = new ParticlePool(500);

    // Setup resize handling
    if (this._options.resize) {
      this._setupResizeHandling();
    }

    // Initial canvas sizing
    this._updateCanvasSize();
  }

  get particles(): readonly IParticle[] {
    return this._particles;
  }

  /**
   * Fire confetti with given options
   */
  async fire(options: IConfettiOptions = {}): Promise<void> {
    // Respect reduced motion preference
    if (this._options.disableForReducedMotion && prefersReducedMotion()) {
      return Promise.resolve();
    }

    if (this.destroyed) {
      throw new Error('Cannot fire on destroyed container');
    }

    const particleCount = options.particleCount ?? 100;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = this._pool.acquire(canvasWidth, canvasHeight, options);
      
      // Initialize with all updaters
      for (const updater of this._updaters) {
        updater.init(particle);
      }
      
      this._particles.push(particle);
    }

    // Start animation if not running
    if (!this._animationId) {
      return new Promise<void>((resolve) => {
        this._resolvePromise = resolve;
        this._lastTimestamp = performance.now();
        this._animationId = requestFrame(this._animate);
      });
    }

    // Animation already running, return existing promise or create new one
    return new Promise<void>((resolve) => {
      const existingResolve = this._resolvePromise;
      this._resolvePromise = () => {
        existingResolve?.();
        resolve();
      };
    });
  }

  /**
   * Stop all animations
   */
  stop(): void {
    if (this._animationId) {
      cancelFrame(this._animationId);
      this._animationId = null;
    }

    // Clear all particles
    for (const particle of this._particles) {
      this._pool.release(particle);
    }
    this._particles.length = 0;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Resolve any pending promise
    this._resolvePromise?.();
    this._resolvePromise = null;
  }

  /**
   * Reset container state
   */
  reset(): void {
    this.stop();
    this._pool.clear();
  }

  /**
   * Destroy container and cleanup resources
   */
  destroy(): void {
    if (this.destroyed) return;

    this.stop();

    // Remove resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    // Remove canvas if we created it
    if (this._isOwnCanvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.destroyed = true;
  }

  /**
   * Animation loop - using arrow function to preserve 'this'
   */
  private _animate = (timestamp: number): void => {
    if (this.destroyed) return;

    const delta = calculateDelta(timestamp, this._lastTimestamp);
    this._lastTimestamp = timestamp;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    let hasActiveParticles = false;
    const particlesToRemove: number[] = [];

    for (let i = 0; i < this._particles.length; i++) {
      const particle = this._particles[i]!;

      if (particle.destroyed) {
        particlesToRemove.push(i);
        continue;
      }

      // Update with all updaters
      for (const updater of this._updaters) {
        if (updater.isEnabled(particle)) {
          updater.update(particle, delta);
        }
      }

      // Check if still alive after update
      if (particle.destroyed) {
        particlesToRemove.push(i);
        continue;
      }

      hasActiveParticles = true;
      this._drawParticle(particle);
    }

    // Remove dead particles (iterate backwards to maintain indices)
    for (let i = particlesToRemove.length - 1; i >= 0; i--) {
      const index = particlesToRemove[i]!;
      const particle = this._particles[index]!;
      this._pool.release(particle);
      this._particles.splice(index, 1);
    }

    // Continue animation or stop
    if (hasActiveParticles) {
      this._animationId = requestFrame(this._animate);
    } else {
      this._animationId = null;
      this._resolvePromise?.();
      this._resolvePromise = null;
    }
  };

  /**
   * Draw a single particle
   */
  private _drawParticle(particle: IParticle): void {
    const ctx = this.ctx;
    const size = particle.size * particle.scalar;

    // Get combined transform values from updaters
    const transform: IParticleTransformValues = { a: 1, b: 0, c: 0, d: 1 };
    
    for (const updater of this._updaters) {
      if (updater.getTransformValues) {
        const values = updater.getTransformValues(particle);
        if (values.a !== undefined) transform.a = values.a;
        if (values.b !== undefined) transform.b = values.b;
        if (values.c !== undefined) transform.c = values.c;
        if (values.d !== undefined) transform.d = values.d;
      }
    }

    // Get roll darkening
    const rollUpdater = this._updaters.find(u => u.id === 'roll') as RollUpdater | undefined;
    const darkenAmount = rollUpdater?.getDarkenAmount(particle) ?? 0;
    const displayColor = darkenAmount > 0 
      ? adjustColorBrightness(particle.color, -darkenAmount)
      : particle.color;

    // Set render state
    ctx.save();
    ctx.translate(particle.position.x, particle.position.y);
    ctx.rotate(particle.rotate?.angle ?? 0);
    
    // Apply transform matrix
    ctx.transform(
      transform.a ?? 1,
      transform.b ?? 0,
      transform.c ?? 0,
      transform.d ?? 1,
      0, 0
    );

    // Set color and opacity
    ctx.fillStyle = displayColor;
    ctx.globalAlpha = particle.opacity;

    // Draw shape
    ctx.beginPath();
    
    const drawer = defaultShapeRegistry.get(particle.shape);
    if (drawer) {
      drawer.draw(ctx, particle, size);
    } else {
      // Fallback to square
      const fallback = defaultShapeRegistry.get('square');
      fallback?.draw(ctx, particle, size);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Create a full-screen canvas
   */
  private _createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.id = this.id;
    
    // Security: use CSP-safe styles
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${this._options.zIndex};
    `;
    
    document.body.appendChild(canvas);
    return canvas;
  }

  /**
   * Setup resize handling with debounce
   */
  private _setupResizeHandling(): void {
    if (typeof ResizeObserver === 'undefined') {
      // Fallback to window resize
      window.addEventListener('resize', this._handleResize);
      return;
    }

    this._resizeObserver = new ResizeObserver(this._handleResize);
    
    if (this._isOwnCanvas) {
      // Observe document body for full-screen canvas
      this._resizeObserver.observe(document.body);
    } else {
      // Observe canvas parent
      if (this.canvas.parentElement) {
        this._resizeObserver.observe(this.canvas.parentElement);
      }
    }
  }

  /**
   * Handle resize events
   */
  private _handleResize = (): void => {
    this._updateCanvasSize();
  };

  /**
   * Update canvas size with pixel ratio
   */
  private _updateCanvasSize(): void {
    const pixelRatio = getPixelRatio();
    
    if (this._isOwnCanvas) {
      // Full-screen canvas - use clientWidth/Height to exclude scrollbar
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      
      // Set both canvas internal size and CSS size to match viewport exactly
      this.canvas.width = width * pixelRatio;
      this.canvas.height = height * pixelRatio;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    } else {
      // Use parent size
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * pixelRatio;
      this.canvas.height = rect.height * pixelRatio;
    }

    // Scale context for pixel ratio
    this.ctx.scale(pixelRatio, pixelRatio);
  }
}
