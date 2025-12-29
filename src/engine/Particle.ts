/**
 * Particle Class
 * 
 * Immutable particle state with builder pattern for creation
 * Following Single Responsibility Principle
 * 
 * @module engine/Particle
 */

import type {
  IParticle,
  ICoordinates,
  IParticleWobble,
  IParticleTilt,
  IParticleRoll,
  IParticleRotate,
  IConfettiOptions,
} from './interfaces';
import {
  generateId,
  getRandom,
  degToRad,
  pickRandom,
} from './utils';

// Default values as frozen constants
const DEFAULT_COLORS = Object.freeze([
  '#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', 
  '#fcff42', '#ffa62d', '#ff36ff'
]);

const DEFAULT_SHAPES = Object.freeze(['square', 'circle']);

const DOUBLE_PI = Math.PI * 2;

/**
 * Particle class implementing IParticle interface
 * Uses factory method for creation to ensure proper initialization
 */
export class Particle implements IParticle {
  readonly id: number;
  position: ICoordinates;
  velocity: number;
  angle2D: number;
  gravity: number;
  drift: number;
  decay: number;
  wobble: IParticleWobble;
  tilt: IParticleTilt;
  roll: IParticleRoll;
  rotate: IParticleRotate;
  color: string;
  shape: string;
  size: number;
  scalar: number;
  flat: boolean;
  tick: number;
  totalTicks: number;
  destroyed: boolean;
  opacity: number;

  private constructor(
    id: number,
    position: ICoordinates,
    velocity: number,
    angle2D: number,
    gravity: number,
    drift: number,
    decay: number,
    wobble: IParticleWobble,
    tilt: IParticleTilt,
    roll: IParticleRoll,
    rotate: IParticleRotate,
    color: string,
    shape: string,
    size: number,
    scalar: number,
    flat: boolean,
    totalTicks: number
  ) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
    this.angle2D = angle2D;
    this.gravity = gravity;
    this.drift = drift;
    this.decay = decay;
    this.wobble = wobble;
    this.tilt = tilt;
    this.roll = roll;
    this.rotate = rotate;
    this.color = color;
    this.shape = shape;
    this.size = size;
    this.scalar = scalar;
    this.flat = flat;
    this.tick = 0;
    this.totalTicks = totalTicks;
    this.destroyed = false;
    this.opacity = 1;
  }

  /**
   * Factory method to create a new particle
   * Encapsulates complex initialization logic
   */
  static create(
    canvasWidth: number,
    canvasHeight: number,
    options: IConfettiOptions = {}
  ): Particle {
    const {
      angle = 90,
      spread = 45,
      startVelocity = 45,
      decay = 0.94,
      gravity = 1,
      drift = 0,
      flat = false,
      ticks = 200,
      origin = { x: 0.5, y: 0.5 },
      colors = DEFAULT_COLORS,
      shapes = DEFAULT_SHAPES,
      scalar = 1,
      size = 4,
    } = options;

    // Calculate position from normalized origin
    const position: ICoordinates = {
      x: origin.x * canvasWidth,
      y: origin.y * canvasHeight,
    };

    // Calculate angle with spread
    const radAngle = degToRad(angle);
    const radSpread = degToRad(spread);
    const angle2D = -radAngle + ((0.5 * radSpread) - (getRandom() * radSpread));

    // Calculate initial velocity with randomization
    const velocity = (startVelocity * 0.5) + (getRandom() * startVelocity);

    // Initialize wobble state
    const wobble: IParticleWobble = {
      angle: getRandom() * DOUBLE_PI,
      angleSpeed: getRandom() * 0.1 + 0.05,
      moveSpeed: -15 + getRandom() * 30,
      distance: 25 + getRandom() * 15,
    };

    // Initialize tilt state
    const tilt: IParticleTilt = {
      value: getRandom() * DOUBLE_PI,
      sinDirection: getRandom() >= 0.5 ? 1 : -1,
      cosDirection: getRandom() >= 0.5 ? 1 : -1,
      speed: (getRandom() * 0.4 + 0.3) * (getRandom() > 0.5 ? 1 : -1),
      enable: !flat,
    };

    // Initialize roll state
    const roll: IParticleRoll = {
      angle: getRandom() * DOUBLE_PI,
      speed: (15 + getRandom() * 10) / 60,
      horizontal: getRandom() > 0.3,
      vertical: getRandom() > 0.7,
      enable: !flat,
    };

    // Initialize rotate state
    const rotate: IParticleRotate = {
      angle: getRandom() * DOUBLE_PI,
      speed: (getRandom() * 2 - 1) * 0.1,
      enable: !flat,
    };

    // Pick random color and shape
    const color = pickRandom(colors as string[]) ?? DEFAULT_COLORS[0]!;
    const shape = pickRandom(shapes as string[]) ?? 'square';

    return new Particle(
      generateId(),
      position,
      velocity,
      angle2D,
      gravity * 3, // Scale gravity
      drift,
      decay,
      wobble,
      tilt,
      roll,
      rotate,
      color,
      shape,
      size,
      scalar,
      flat,
      ticks
    );
  }

  /**
   * Get progress of particle lifecycle (0-1)
   */
  get progress(): number {
    return this.tick / this.totalTicks;
  }

  /**
   * Get computed size with scalar
   */
  get computedSize(): number {
    return this.size * this.scalar;
  }

  /**
   * Mark particle as destroyed
   */
  destroy(): void {
    this.destroyed = true;
  }

  /**
   * Clone particle with optional overrides
   */
  clone(overrides?: Partial<IParticle>): Particle {
    const cloned = Object.create(Particle.prototype) as Particle;
    Object.assign(cloned, this, overrides);
    return cloned;
  }
}

/**
 * Particle Pool for object reuse (performance optimization)
 * Implements Object Pool Pattern
 */
export class ParticlePool {
  private readonly pool: Particle[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Get a particle from pool or create new one
   */
  acquire(
    canvasWidth: number,
    canvasHeight: number,
    options: IConfettiOptions
  ): Particle {
    const pooled = this.pool.pop();
    if (pooled) {
      // Reset pooled particle
      return this.resetParticle(pooled, canvasWidth, canvasHeight, options);
    }
    return Particle.create(canvasWidth, canvasHeight, options);
  }

  /**
   * Return particle to pool for reuse
   */
  release(particle: Particle): void {
    if (this.pool.length < this.maxSize) {
      particle.destroyed = true;
      this.pool.push(particle);
    }
  }

  /**
   * Clear the pool
   */
  clear(): void {
    this.pool.length = 0;
  }

  /**
   * Get current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  private resetParticle(
    particle: Particle,
    canvasWidth: number,
    canvasHeight: number,
    options: IConfettiOptions
  ): Particle {
    // Create new particle and copy properties
    const fresh = Particle.create(canvasWidth, canvasHeight, options);
    Object.assign(particle, fresh, { id: particle.id });
    particle.destroyed = false;
    return particle;
  }
}
