/**
 * Core types for react-confetti-burst
 * 
 * This module provides comprehensive TypeScript definitions for all
 * configuration options, particle properties, and animation states.
 * 
 * Features beyond react-confetti AND canvas-confetti:
 * - Directional bursts with custom angles
 * - Multiple effect modes (burst, continuous, firework, snow, cannon)
 * - Custom draw functions with full context
 * - Emoji and image particle support
 * - Trails and glow effects
 * - Preset configurations
 * - Auto-resize support
 * - Frame rate control
 * - Spawn area configuration
 * - SVG path shapes (shapeFromPath)
 * - Text/emoji shapes (shapeFromText)
 * - Web Worker rendering (useWorker)
 * - Reduced motion accessibility
 * - Custom canvas support
 */

/**
 * Represents a 2D point in space
 */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * Normalized origin (0-1 coordinates like canvas-confetti)
 */
export interface NormalizedOrigin {
  /** X position (0 = left, 1 = right). Default: 0.5 */
  readonly x: number;
  /** Y position (0 = top, 1 = bottom). Default: 0.5 */
  readonly y: number;
}

/**
 * Represents a 2D vector for physics calculations
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * RGBA color representation
 */
export interface RGBAColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/**
 * Gradient color for particles
 */
export interface GradientColor {
  readonly type: 'linear' | 'radial';
  readonly colors: readonly string[];
  readonly angle?: number;
}

/**
 * Supported color formats for confetti particles
 */
export type ColorInput = string | RGBAColor | GradientColor;

/**
 * Bounds for a path shape
 */
export interface PathBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

/**
 * Custom shape created from SVG path (canvas-confetti compatible)
 */
export interface PathShape {
  readonly type: 'path';
  /** SVG path string (d attribute) */
  readonly path: string;
  /** Optional 2D transformation matrix [a, b, c, d, e, f] */
  readonly matrix?: DOMMatrix | readonly number[];
  /** Optional fill color (uses particle color if not set) */
  readonly fillColor?: string;
  /** Optional stroke color */
  readonly strokeColor?: string;
  /** Optional stroke width */
  readonly strokeWidth?: number;
  /** Calculated path bounds for scaling */
  readonly bounds?: PathBounds;
  /** Cached Path2D object for performance */
  readonly _path2D?: Path2D;
}

/**
 * Custom shape created from text/emoji (canvas-confetti compatible)
 */
export interface TextShape {
  readonly type: 'text';
  /** Text or emoji to render */
  readonly text: string;
  /** Scale factor. Default: 1 */
  readonly scalar?: number;
  /** Text color (uses particle color if not set) */
  readonly color?: string;
  /** Font family. Default: 'serif' */
  readonly fontFamily?: string;
  /** Font weight. Default: 'normal' */
  readonly fontWeight?: string;
  /** Font style. Default: 'normal' */
  readonly fontStyle?: 'normal' | 'italic' | 'oblique';
  /** Cached bitmap for performance */
  readonly _bitmap?: ImageBitmap | HTMLCanvasElement;
}

/**
 * Custom shape union type
 */
export type CustomShape = PathShape | TextShape;

/**
 * Shape types for confetti particles
 */
export type ParticleShape = 
  | 'square' 
  | 'circle' 
  | 'rectangle' 
  | 'triangle' 
  | 'star' 
  | 'line'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'spiral'
  | 'ribbon'
  | 'custom'
  | CustomShape;

/**
 * Shape input (string or custom shape object)
 */
export type ShapeInput = Exclude<ParticleShape, CustomShape> | CustomShape;

/**
 * Direction presets for confetti bursts
 */
export type BurstDirection = 
  | 'up' 
  | 'down' 
  | 'left' 
  | 'right' 
  | 'radial' 
  | 'custom';

/**
 * Effect mode for confetti
 */
export type EffectMode = 
  | 'burst'      // Single burst of particles
  | 'continuous' // Continuous stream (like react-confetti's recycle)
  | 'firework'   // Explodes then secondary explosions
  | 'snow'       // Gentle falling particles
  | 'cannon'     // Shoots in a direction
  | 'fountain'   // Continuous upward fountain
  | 'rain'       // Falling particles from top
  | 'explosion'; // Radial explosion with physics

/**
 * Easing function type for animations
 */
export type EasingFunction = (t: number) => number;

/**
 * Easing preset names
 */
export type EasingPreset = 
  | 'linear' 
  | 'easeIn' 
  | 'easeOut' 
  | 'easeInOut' 
  | 'bounce' 
  | 'elastic'
  | 'back'
  | 'circ'
  | 'expo';

/**
 * Custom draw function context
 */
export interface DrawContext {
  /** Canvas 2D rendering context */
  readonly ctx: CanvasRenderingContext2D;
  /** Particle being drawn */
  readonly particle: ParticleState;
  /** Current progress (0-1) */
  readonly progress: number;
  /** Time since animation started (ms) */
  readonly elapsed: number;
}

/**
 * Custom draw function type
 */
export type CustomDrawFunction = (context: DrawContext) => void;

/**
 * Configuration for particle physics behavior
 */
export interface PhysicsConfig {
  /** Gravity strength (positive = downward). Default: 0.25 */
  readonly gravity: number;
  /** Air resistance factor (0-1). Default: 0.035 */
  readonly drag: number;
  /** Friction coefficient (0-1). Default: 0.985 */
  readonly friction: number;
  /** Rotation speed multiplier. Default: 1.5 */
  readonly rotationSpeed: number;
  /** Wind force applied horizontally. Default: 0 */
  readonly wind: number;
  /** Wind variation range. Default: 0.02 */
  readonly windVariation: number;
  /** Whether particles should tumble/rotate. Default: true */
  readonly tumble: boolean;
  /** Velocity decay per frame (0-1). Default: 0.99 */
  readonly decay: number;
  /** Bounce factor when hitting edges (0 = no bounce, 1 = full). Default: 0 */
  readonly bounce: number;
  /** Floor Y position for bouncing (null = no floor). Default: null */
  readonly floor: number | null;
  /** Enable 3D wobble effect. Default: true */
  readonly wobble: boolean;
  /** Wobble speed. Default: 1.5 */
  readonly wobbleSpeed: number;
  /** Enable flutter effect for paper-like movement. Default: true */
  readonly flutter?: boolean;
  /** Flutter oscillation speed. Default: 2.5 */
  readonly flutterSpeed?: number;
  /** Flutter intensity (0-1). Default: 0.4 */
  readonly flutterIntensity?: number;
  /** Air resistance based on particle surface area. Default: 0.03 */
  readonly airResistance?: number;
  /** Amplitude of side-to-side sway. Default: 15 */
  readonly swayAmplitude?: number;
  /** Frequency of sway oscillation. Default: 2 */
  readonly swayFrequency?: number;
}

/**
 * Configuration for the burst direction and spread
 */
export interface DirectionConfig {
  /** Direction preset or 'custom' for manual angle. Default: 'up' */
  readonly direction: BurstDirection;
  /** Custom angle in degrees (0 = right, 90 = up). Used when direction is 'custom' */
  readonly angle?: number;
  /** Spread angle in degrees for the burst cone. Default: 55 */
  readonly spread: number;
  /** Initial velocity range [min, max]. Default: [25, 50] */
  readonly velocity: readonly [number, number];
  /** Initial velocity X range { min, max } (alternative to velocity/angle) */
  readonly initialVelocityX?: { readonly min: number; readonly max: number } | number;
  /** Initial velocity Y range { min, max } (alternative to velocity/angle) */
  readonly initialVelocityY?: { readonly min: number; readonly max: number } | number;
  /** How quickly initial velocity decays. Default: 0.92 */
  readonly velocityDecay?: number;
}

/**
 * Spawn area type
 */
export type SpawnAreaType = 'point' | 'rect' | 'line' | 'circle';

/**
 * Spawn area configuration (confettiSource equivalent)
 */
export interface SpawnArea {
  /** Type of spawn area */
  readonly type: SpawnAreaType;
  /** X position of spawn area */
  readonly x: number;
  /** Y position of spawn area */
  readonly y: number;
  /** Width of spawn area (or radius for circle) */
  readonly w?: number;
  /** Height of spawn area */
  readonly h?: number;
  /** Legacy aliases */
  readonly width?: number;
  readonly height?: number;
}

/**
 * Trail effect configuration
 */
export interface TrailConfig {
  /** Enable trail effect. Default: false */
  readonly enabled: boolean;
  /** Trail length (number of positions to remember). Default: 10 */
  readonly length: number;
  /** Trail fade factor (0-1). Default: 0.5 */
  readonly fade: number;
  /** Trail width multiplier. Default: 0.5 */
  readonly width: number;
}

/**
 * Glow effect configuration
 */
export interface GlowConfig {
  /** Enable glow effect. Default: false */
  readonly enabled: boolean;
  /** Glow blur radius. Default: 10 */
  readonly blur: number;
  /** Glow color (null = use particle color). Default: null */
  readonly color: string | null;
  /** Glow intensity (0-1). Default: 0.5 */
  readonly intensity: number;
}

/**
 * Image/Emoji particle configuration
 */
export interface ImageParticle {
  /** Image source URL or emoji string */
  readonly src: string;
  /** Whether this is an emoji (true) or image URL (false) */
  readonly isEmoji: boolean;
  /** Scale factor for the image. Default: 1 */
  readonly scale?: number;
}

/**
 * Configuration for individual particles
 */
export interface ParticleConfig {
  /** Array of colors for particles. Default: rainbow palette */
  readonly colors: readonly ColorInput[];
  /** Particle shapes to use. Default: ['square', 'rectangle', 'circle'] */
  readonly shapes: readonly ParticleShape[];
  /** Size range [min, max] in pixels. Default: [6, 14] */
  readonly size: readonly [number, number];
  /** Opacity range [min, max]. Default: [0.85, 1] */
  readonly opacity: readonly [number, number];
  /** Lifespan in milliseconds. Default: 4000 */
  readonly lifespan: number;
  /** Whether to fade out particles. Default: true */
  readonly fadeOut: boolean;
  /** Whether to scale down particles over time. Default: false */
  readonly scaleDown: boolean;
  /** Custom draw function for 'custom' shape */
  readonly drawShape?: CustomDrawFunction;
  /** Image/emoji particles (overrides shapes if provided) */
  readonly images?: readonly ImageParticle[];
  /** Trail effect configuration */
  readonly trail?: Partial<TrailConfig>;
  /** Glow effect configuration */
  readonly glow?: Partial<GlowConfig>;
  /** Whether particles should spin. Default: true */
  readonly spin: boolean;
  /** Spin speed range [min, max]. Default: [-15, 15] */
  readonly spinSpeed: readonly [number, number];
  /** Tilt range in degrees [min, max]. Default: [-30, 30] */
  readonly tilt: readonly [number, number];
  /** 3D depth effect (0 = flat, 1 = full 3D). Default: 0.6 */
  readonly depth3D: number;
  /** Aspect ratio range for paper-like particle shapes [min, max]. Default: [0.5, 1.5] */
  readonly aspectRatio?: readonly [number, number];
  /** Enable shimmer/shine effect. Default: true */
  readonly shimmer?: boolean;
}

/**
 * Continuous mode configuration
 */
export interface ContinuousConfig {
  /** Whether to recycle particles (continuous mode). Default: false */
  readonly recycle: boolean;
  /** Number of particles to maintain. Default: 200 */
  readonly numberOfPieces: number;
  /** Spawn rate (particles per second). Default: 50 */
  readonly spawnRate: number;
  /** Whether animation is running. Default: true */
  readonly run: boolean;
  /** Duration to add particles (tween duration). Default: 5000 */
  readonly tweenDuration: number;
}

/**
 * Firework mode configuration
 */
export interface FireworkConfig {
  /** Enable secondary explosions. Default: true */
  readonly secondaryExplosions: boolean;
  /** Number of particles per burst. Default: 80 */
  readonly burstCount: number;
  /** Delay between fireworks (ms). Default: 500 */
  readonly burstDelay: number;
  /** Spread angle in degrees. Default: 360 */
  readonly spread: number;
  /** Height at which to explode (0-1 ratio of viewport). Default: 0.6 */
  readonly launchHeight: number;
  /** Rocket colors */
  readonly rocketColors: readonly string[];
  /** Burst colors */
  readonly burstColors: readonly string[];
  /** Trail length for particles */
  readonly trailLength: number;
  /** Rise duration in ms. Default: 1000 */
  readonly riseDuration: number;
  /** Show rocket trail. Default: true */
  readonly showRocket: boolean;
}

/**
 * Canvas configuration
 */
export interface CanvasConfig {
  /** Canvas width (null = auto/viewport). Default: null */
  readonly width: number | null;
  /** Canvas height (null = auto/viewport). Default: null */
  readonly height: number | null;
  /** Auto-resize on window resize. Default: true */
  readonly autoResize: boolean;
  /** Resize debounce delay (ms). Default: 100 */
  readonly resizeDebounce: number;
  /** Frame rate cap (null = uncapped/60fps). Default: null */
  readonly frameRate: number | null;
  /** Device pixel ratio override (null = auto). Default: null */
  readonly pixelRatio: number | null;
  /** Canvas CSS class name */
  readonly className?: string;
  /** Canvas inline styles */
  readonly style?: React.CSSProperties;
  /** Use Web Worker for rendering (off main thread). Default: false */
  readonly useWorker: boolean;
  /** Use OffscreenCanvas if available. Default: false */
  readonly useOffscreen: boolean;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /** Disable confetti for users who prefer reduced motion. Default: false */
  readonly disableForReducedMotion: boolean;
  /** ARIA label for the canvas. Default: 'Confetti animation' */
  readonly ariaLabel?: string;
  /** Whether to hide from screen readers. Default: true */
  readonly ariaHidden: boolean;
}

/**
 * canvas-confetti compatible options
 * These match the API of canvas-confetti for easy migration
 */
export interface CanvasConfettiOptions {
  /** Number of confetti to launch. Default: 50 */
  readonly particleCount?: number;
  /** Angle to launch confetti in degrees (90 = straight up). Default: 90 */
  readonly angle?: number;
  /** Spread angle in degrees. Default: 45 */
  readonly spread?: number;
  /** Initial velocity in pixels. Default: 45 */
  readonly startVelocity?: number;
  /** Speed decay factor (0-1). Default: 0.9 */
  readonly decay?: number;
  /** Gravity (1 = full, 0 = none). Default: 1 */
  readonly gravity?: number;
  /** Horizontal drift (-1 to 1). Default: 0 */
  readonly drift?: number;
  /** Disable 3D tilt/wobble (2D mode). Default: false */
  readonly flat?: boolean;
  /** Number of animation frames. Default: 200 */
  readonly ticks?: number;
  /** Origin position (0-1 coordinates) */
  readonly origin?: NormalizedOrigin;
  /** Colors in hex format */
  readonly colors?: readonly string[];
  /** Shapes (strings or custom shape objects) */
  readonly shapes?: readonly ShapeInput[];
  /** Scale factor for particles. Default: 1 */
  readonly scalar?: number;
  /** Z-index for canvas. Default: 100 */
  readonly zIndex?: number;
  /** Disable for reduced motion preference. Default: false */
  readonly disableForReducedMotion?: boolean;
}

/**
 * Global options for confetti.create()
 */
export interface ConfettiCreateOptions {
  /** Whether to resize canvas with window. Default: false */
  readonly resize?: boolean;
  /** Whether to use Web Worker for rendering. Default: false */
  readonly useWorker?: boolean;
  /** Disable for reduced motion users. Default: false */
  readonly disableForReducedMotion?: boolean;
}

/**
 * Main configuration for the confetti burst
 */
export interface ConfettiBurstConfig {
  /** Number of particles to emit. Default: 50 */
  readonly particleCount: number;
  /** Particle configuration */
  readonly particle: ParticleConfig;
  /** Physics configuration */
  readonly physics: PhysicsConfig;
  /** Direction configuration */
  readonly direction: DirectionConfig;
  /** Effect mode. Default: 'burst' */
  readonly mode: EffectMode;
  /** Spawn area configuration */
  readonly spawnArea?: SpawnArea;
  /** Continuous mode configuration */
  readonly continuous?: Partial<ContinuousConfig>;
  /** Firework mode configuration */
  readonly firework?: Partial<FireworkConfig>;
  /** Canvas configuration */
  readonly canvas?: Partial<CanvasConfig>;
  /** Accessibility configuration */
  readonly accessibility?: Partial<AccessibilityConfig>;
  /** Easing preset for animation. Default: 'easeOut' */
  readonly easing: EasingPreset;
  /** Z-index for the canvas overlay. Default: 9999 */
  readonly zIndex: number;
  /** Whether to auto-clean canvas when animation ends. Default: true */
  readonly autoCleanup: boolean;
  /** Global scale factor for all particles. Default: 1 */
  readonly scalar: number;
  /** Horizontal drift factor (-1 to 1). Default: 0 */
  readonly drift: number;
  /** Number of animation frames/ticks. Overrides lifespan if set */
  readonly ticks?: number;
  /** Disable 3D tilt/wobble effects (2D mode). Default: false */
  readonly flat: boolean;
  /** Callback when animation starts */
  readonly onStart?: () => void;
  /** Callback when animation ends */
  readonly onComplete?: () => void;
  /** Callback on each frame with particle count */
  readonly onFrame?: (particleCount: number) => void;
  /** Callback when a particle is created */
  readonly onParticleCreate?: (particle: ParticleState) => void;
  /** Callback when a particle dies */
  readonly onParticleDeath?: (particle: ParticleState) => void;
}

/**
 * Partial configuration allowing users to override specific options
 */
export type ConfettiBurstOptions = Partial<{
  readonly particleCount: number;
  readonly particle: Partial<ParticleConfig>;
  readonly physics: Partial<PhysicsConfig>;
  readonly direction: Partial<DirectionConfig>;
  readonly mode: EffectMode;
  readonly spawnArea: Partial<SpawnArea>;
  readonly continuous: Partial<ContinuousConfig>;
  readonly firework: Partial<FireworkConfig>;
  readonly canvas: Partial<CanvasConfig>;
  readonly accessibility: Partial<AccessibilityConfig>;
  readonly easing: EasingPreset;
  readonly zIndex: number;
  readonly autoCleanup: boolean;
  readonly scalar: number;
  readonly drift: number;
  readonly ticks: number;
  readonly flat: boolean;
  readonly onStart: () => void;
  readonly onComplete: () => void;
  readonly onFrame: (particleCount: number) => void;
  readonly onParticleCreate: (particle: ParticleState) => void;
  readonly onParticleDeath: (particle: ParticleState) => void;
}>;

/**
 * Origin point for the burst
 */
export interface BurstOrigin {
  /** X coordinate (relative to viewport or element) */
  readonly x: number;
  /** Y coordinate (relative to viewport or element) */
  readonly y: number;
}

/**
 * Trail position for trail effect
 */
export interface TrailPosition {
  x: number;
  y: number;
  opacity: number;
  size: number;
}

/**
 * Internal particle state
 */
export interface ParticleState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  originalSize: number;
  rotation: number;
  rotationSpeed: number;
  color: RGBAColor;
  shape: ParticleShape;
  opacity: number;
  originalOpacity: number;
  life: number;
  maxLife: number;
  active: boolean;
  /** Image/emoji source if using image particles */
  image?: ImageParticle;
  /** Loaded image element for image particles */
  imageElement?: HTMLImageElement | null;
  /** Trail positions for trail effect */
  trail: TrailPosition[];
  /** Wobble phase for 3D effect */
  wobblePhase: number;
  /** Wobble speed for 3D effect */
  wobbleSpeed: number;
  /** Tilt angle in radians */
  tilt: number;
  /** Tilt speed */
  tiltSpeed: number;
  /** 3D depth factor */
  depth: number;
  /** Whether this particle has exploded (firework mode) */
  hasExploded: boolean;
  /** Custom data storage */
  data: Record<string, unknown>;
  // New properties for realistic movement
  /** Flutter phase for paper-like oscillation */
  flutterPhase: number;
  /** Flutter speed multiplier */
  flutterSpeed: number;
  /** Sway phase for side-to-side movement */
  swayPhase: number;
  /** Aspect ratio for the particle (width/height) */
  aspectRatio: number;
  /** Angular velocity for more realistic rotation */
  angularVelocity: number;
  /** Current scale for 3D flip effect (X axis) */
  scaleX: number;
  /** Current scale for 3D flip effect (Y axis) */
  scaleY: number;
  /** Shimmer phase for shine effect */
  shimmerPhase: number;
  /** Individual air resistance based on orientation */
  currentDrag: number;
}

/**
 * Animation frame state
 */
export interface AnimationState {
  readonly isRunning: boolean;
  readonly isPaused: boolean;
  readonly frameId: number | null;
  readonly startTime: number | null;
  readonly lastFrameTime: number;
  readonly particles: ParticleState[];
  readonly particleCount: number;
  readonly elapsedTime: number;
  readonly fps: number;
}

/**
 * Canvas context wrapper for type safety
 */
export interface CanvasContext {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
  readonly dpr: number;
}

/**
 * Result from the explosion trigger function
 */
export interface ExplosionHandle {
  /** Stop the animation immediately */
  readonly stop: () => void;
  /** Pause the animation */
  readonly pause: () => void;
  /** Resume a paused animation */
  readonly resume: () => void;
  /** Add more particles to running animation */
  readonly addParticles: (count: number) => void;
  /** Clear all particles immediately */
  readonly clear: () => void;
  /** Get current particle count */
  readonly getParticleCount: () => number;
  /** Get animation state */
  readonly getState: () => 'running' | 'paused' | 'stopped';
  /** Promise that resolves when animation completes */
  readonly promise: Promise<void>;
}

/**
 * Hook return type for useConfetti
 */
export interface UseConfettiReturn {
  /** Trigger confetti from a point */
  readonly fire: (origin: BurstOrigin, options?: ConfettiBurstOptions) => ExplosionHandle;
  /** Trigger confetti from an element */
  readonly fireFromElement: (element: HTMLElement | null, options?: ConfettiBurstOptions) => ExplosionHandle | null;
  /** Check if animation is currently running */
  readonly isActive: boolean;
  /** Stop all active animations */
  readonly stopAll: () => void;
  /** Pause all active animations */
  readonly pauseAll: () => void;
  /** Resume all paused animations */
  readonly resumeAll: () => void;
  /** Get all active handles */
  readonly getActiveHandles: () => ExplosionHandle[];
}

/**
 * Props for the ConfettiBurst component
 */
export interface ConfettiBurstProps {
  /** Whether the confetti should be triggered */
  readonly active: boolean;
  /** Origin point for the burst */
  readonly origin?: BurstOrigin;
  /** Reference to the trigger element (alternative to origin) */
  readonly triggerRef?: React.RefObject<HTMLElement>;
  /** Configuration options */
  readonly options?: ConfettiBurstOptions;
  /** Callback when animation completes */
  readonly onComplete?: () => void;
}

/**
 * Props for the ConfettiButton component
 */
export interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Configuration options */
  readonly confettiOptions?: ConfettiBurstOptions;
  /** Whether to fire on click. Default: true */
  readonly fireOnClick?: boolean;
  /** Children elements */
  readonly children: React.ReactNode;
}

/**
 * Props for the Confetti component (react-confetti compatible API)
 */
export interface ConfettiProps {
  /** Canvas width */
  readonly width?: number;
  /** Canvas height */
  readonly height?: number;
  /** Number of confetti pieces at one time */
  readonly numberOfPieces?: number;
  /** Rectangle where confetti should spawn */
  readonly confettiSource?: SpawnArea;
  /** Friction coefficient */
  readonly friction?: number;
  /** Wind force */
  readonly wind?: number;
  /** Gravity strength */
  readonly gravity?: number;
  /** Initial horizontal velocity */
  readonly initialVelocityX?: number | { min: number; max: number };
  /** Initial vertical velocity */
  readonly initialVelocityY?: number | { min: number; max: number };
  /** Colors array */
  readonly colors?: string[];
  /** Opacity */
  readonly opacity?: number;
  /** Keep spawning confetti */
  readonly recycle?: boolean;
  /** Run the animation */
  readonly run?: boolean;
  /** Frame rate cap */
  readonly frameRate?: number;
  /** Tween duration */
  readonly tweenDuration?: number;
  /** Tween function */
  readonly tweenFunction?: EasingFunction;
  /** Custom draw function */
  readonly drawShape?: (ctx: CanvasRenderingContext2D) => void;
  /** Callback when all confetti has fallen */
  readonly onConfettiComplete?: () => void;
  /** Canvas ref */
  readonly canvasRef?: React.RefObject<HTMLCanvasElement>;
  /** Canvas class name */
  readonly className?: string;
  /** Canvas style */
  readonly style?: React.CSSProperties;
}

/**
 * Preset configuration names
 */
export type PresetName = 
  | 'default'
  | 'celebration'
  | 'firework'
  | 'snow'
  | 'rain'
  | 'sparkle'
  | 'confetti'
  | 'emoji'
  | 'hearts'
  | 'stars'
  | 'money'
  | 'pride'
  | 'christmas'
  | 'halloween'
  | 'newYear'
  | 'birthday';

/**
 * Preset configuration
 */
export interface PresetConfig {
  readonly name: PresetName;
  readonly options: ConfettiBurstOptions;
  readonly description: string;
}
