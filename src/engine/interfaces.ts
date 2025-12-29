/**
 * Core Interfaces for the Confetti Engine
 * 
 * Following Interface Segregation Principle (ISP) from SOLID
 * Each interface has a single, focused responsibility
 * 
 * @module engine/interfaces
 */

/**
 * Delta time information for frame-independent animations
 */
export interface IDelta {
  /** Raw milliseconds since last frame */
  readonly value: number;
  /** Normalized factor (typically value/16.67 for 60fps baseline) */
  readonly factor: number;
}

/**
 * 2D coordinate position
 */
export interface ICoordinates {
  x: number;
  y: number;
}

/**
 * Normalized origin (0-1 range)
 */
export interface INormalizedOrigin {
  readonly x: number;
  readonly y: number;
}

/**
 * Range value for randomization
 */
export interface IRangeValue {
  readonly min: number;
  readonly max: number;
}

/**
 * Transform values for canvas rendering
 * Maps to canvas transform matrix: [a, b, c, d, e, f]
 */
export interface IParticleTransformValues {
  /** Horizontal scaling */
  a?: number;
  /** Vertical skewing */
  b?: number;
  /** Horizontal skewing */
  c?: number;
  /** Vertical scaling */
  d?: number;
}

/**
 * Particle wobble state (side-to-side sway)
 */
export interface IParticleWobble {
  angle: number;
  angleSpeed: number;
  moveSpeed: number;
  distance: number;
}

/**
 * Particle tilt state (3D rotation effect)
 */
export interface IParticleTilt {
  value: number;
  sinDirection: number;
  cosDirection: number;
  speed: number;
  enable: boolean;
}

/**
 * Particle roll state (flip animation)
 */
export interface IParticleRoll {
  angle: number;
  speed: number;
  horizontal: boolean;
  vertical: boolean;
  enable: boolean;
}

/**
 * Particle rotate state (2D spin)
 */
export interface IParticleRotate {
  angle: number;
  speed: number;
  enable: boolean;
}

/**
 * Interface for particle updaters
 * Following Strategy Pattern - each updater handles specific behavior
 */
export interface IParticleUpdater {
  /** Unique identifier for the updater */
  readonly id: string;
  
  /** Initialize particle properties for this updater */
  init(particle: IParticle): void;
  
  /** Check if this updater should be applied to the particle */
  isEnabled(particle: IParticle): boolean;
  
  /** Update particle state */
  update(particle: IParticle, delta: IDelta): void;
  
  /** Optional: Get transform values for rendering */
  getTransformValues?(particle: IParticle): IParticleTransformValues;
  
  /** Optional: Called before particle is drawn */
  beforeDraw?(particle: IParticle, ctx: CanvasRenderingContext2D): void;
  
  /** Optional: Called after particle is drawn */
  afterDraw?(particle: IParticle, ctx: CanvasRenderingContext2D): void;
  
  /** Optional: Called when particle is destroyed */
  particleDestroyed?(particle: IParticle): void;
  
  /** Optional: Reset particle state */
  reset?(particle: IParticle): void;
}

/**
 * Interface for particle movers
 * Handles position updates separately from visual effects
 */
export interface IParticleMover {
  /** Unique identifier for the mover */
  readonly id: string;
  
  /** Initialize particle movement properties */
  init(particle: IParticle): void;
  
  /** Check if this mover should be applied */
  isEnabled(particle: IParticle): boolean;
  
  /** Move the particle */
  move(particle: IParticle, delta: IDelta): void;
}

/**
 * Interface for shape drawers
 * Following Open/Closed Principle - extend via new drawers, not modification
 */
export interface IShapeDrawer {
  /** Shape type identifier */
  readonly type: string;
  
  /** Draw the shape */
  draw(ctx: CanvasRenderingContext2D, particle: IParticle, radius: number): void;
  
  /** Optional: Initialize particle for this shape */
  particleInit?(particle: IParticle): void;
  
  /** Optional: Cleanup when particle is destroyed */
  particleDestroy?(particle: IParticle): void;
}

/**
 * Core particle interface
 */
export interface IParticle {
  /** Unique particle ID */
  readonly id: number;
  
  /** Current position */
  position: ICoordinates;
  
  /** Current velocity */
  velocity: number;
  
  /** Movement angle in radians */
  angle2D: number;
  
  /** Gravity factor */
  gravity: number;
  
  /** Horizontal drift */
  drift: number;
  
  /** Velocity decay factor */
  decay: number;
  
  /** Wobble state */
  wobble: IParticleWobble;
  
  /** Tilt state */
  tilt: IParticleTilt;
  
  /** Roll state */
  roll: IParticleRoll;
  
  /** Rotate state */
  rotate: IParticleRotate;
  
  /** Particle color (hex or rgb) */
  color: string;
  
  /** Shape type */
  shape: string;
  
  /** Base size in pixels */
  size: number;
  
  /** Scale multiplier */
  scalar: number;
  
  /** Whether 3D effects are disabled */
  flat: boolean;
  
  /** Current animation tick */
  tick: number;
  
  /** Total ticks before particle dies */
  totalTicks: number;
  
  /** Whether particle is destroyed */
  destroyed: boolean;
  
  /** Opacity (0-1) */
  opacity: number;
}

/**
 * Container configuration options
 */
export interface IContainerOptions {
  /** Canvas element to render on */
  canvas?: HTMLCanvasElement;
  /** Auto-resize canvas with window */
  resize?: boolean;
  /** Z-index for auto-created canvas */
  zIndex?: number;
  /** Disable for reduced motion preference */
  disableForReducedMotion?: boolean;
}

/**
 * Confetti launch options
 */
export interface IConfettiOptions {
  /** Number of particles to launch */
  particleCount?: number;
  /** Base particle size in pixels */
  size?: number;
  /** Launch angle in degrees (90 = up) */
  angle?: number;
  /** Spread angle in degrees */
  spread?: number;
  /** Initial velocity */
  startVelocity?: number;
  /** Velocity decay (0-1) */
  decay?: number;
  /** Gravity strength */
  gravity?: number;
  /** Horizontal drift */
  drift?: number;
  /** Disable 3D effects */
  flat?: boolean;
  /** Animation duration in ticks */
  ticks?: number;
  /** Launch origin (0-1 coordinates) */
  origin?: INormalizedOrigin;
  /** Particle colors */
  colors?: readonly string[];
  /** Particle shapes */
  shapes?: readonly string[];
  /** Scale multiplier */
  scalar?: number;
}

/**
 * Container interface for managing particle systems
 */
export interface IContainer {
  /** Container unique ID */
  readonly id: string;
  /** Canvas element */
  readonly canvas: HTMLCanvasElement;
  /** Canvas 2D context */
  readonly ctx: CanvasRenderingContext2D;
  /** Whether container is destroyed */
  destroyed: boolean;
  /** Current particles */
  readonly particles: readonly IParticle[];
  
  /** Fire confetti */
  fire(options?: IConfettiOptions): Promise<void>;
  /** Stop all animations */
  stop(): void;
  /** Reset container */
  reset(): void;
  /** Destroy container and cleanup */
  destroy(): void;
}

/**
 * Engine interface for managing containers
 */
export interface IEngine {
  /** Register a particle updater */
  addUpdater(updater: IParticleUpdater): void;
  /** Register a particle mover */
  addMover(mover: IParticleMover): void;
  /** Register a shape drawer */
  addShapeDrawer(drawer: IShapeDrawer): void;
  /** Get all registered updaters */
  getUpdaters(): readonly IParticleUpdater[];
  /** Get all registered movers */
  getMovers(): readonly IParticleMover[];
  /** Get shape drawer by type */
  getShapeDrawer(type: string): IShapeDrawer | undefined;
  /** Create a new container */
  createContainer(options?: IContainerOptions): IContainer;
  /** Destroy all containers */
  destroyAll(): void;
}
