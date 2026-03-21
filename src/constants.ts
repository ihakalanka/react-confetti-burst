/**
 * Default constants and configuration values
 * 
 * All default values are carefully tuned for optimal visual appeal
 * and performance across different devices and screen sizes.
 */

import type {
  ConfettiBurstConfig,
  ParticleConfig,
  PhysicsConfig,
  DirectionConfig,
  RGBAColor,
  ContinuousConfig,
  FireworkConfig,
  CanvasConfig,
  TrailConfig,
  GlowConfig,
} from './types';

/**
 * Default vibrant color palette for confetti particles
 * Designed for high visibility on both light and dark backgrounds
 */
export const DEFAULT_COLORS: readonly string[] = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#F38181', // Salmon
  '#AA96DA', // Lavender
  '#FCBAD3', // Pink
  '#A8D8EA', // Sky Blue
  '#FF9A8B', // Peach
  '#88D8B0', // Sea Green
] as const;

/**
 * Default physics configuration
 * Tuned for realistic paper/confetti behavior
 */
export const DEFAULT_PHYSICS: PhysicsConfig = {
  gravity: 1,              // Standard gravity for natural fall
  drag: 0.035,             // More air resistance for paper-like flutter
  friction: 0.99,          // Slightly more friction
  rotationSpeed: 1,        // Moderate tumbling
  wind: 0,
  windVariation: 0.02,     // Subtle wind variation for natural movement
  tumble: true,
  decay: 0.99,             // Slower decay for longer flight
  bounce: 0,
  floor: null,
  wobble: true,            // Enable wobble by default
  wobbleSpeed: 1.5,        // Natural wobble speed
  flutter: true,           // New: Enable flutter effect
  flutterSpeed: 2.5,       // New: Flutter oscillation speed
  flutterIntensity: 0.4,   // New: How much flutter affects movement
  airResistance: 0.03,     // New: Additional air resistance based on surface area
  swayAmplitude: 15,       // New: How much particles sway side-to-side
  swayFrequency: 2,        // New: Sway oscillation frequency
} as const;

/**
 * Default direction configuration
 * Natural burst pattern with good spread
 */
export const DEFAULT_DIRECTION: DirectionConfig = {
  direction: 'up',
  spread: 55,              // Wider spread for more natural look
  velocity: [25, 50] as const,  // Higher velocity range for explosive feel
  velocityDecay: 0.92,     // New: How quickly initial velocity decays
} as const;

/**
 * Default particle configuration
 * Optimized for realistic confetti appearance
 */
export const DEFAULT_PARTICLE: ParticleConfig = {
  colors: DEFAULT_COLORS,
  shapes: ['square', 'rectangle', 'circle'] as const,  // Rectangle adds paper-like variety
  size: [6, 14] as const,        // More size variation
  opacity: [0.85, 1] as const,
  lifespan: 4000,                // Longer lifespan for slower fall
  fadeOut: true,
  scaleDown: false,              // Real confetti doesn't shrink
  spin: true,
  spinSpeed: [-15, 15] as const, // More spin variation
  tilt: [-30, 30] as const,      // More tilt for 3D paper effect
  depth3D: 0.6,                  // Enable 3D depth effect by default
  aspectRatio: [0.5, 1.5] as const, // New: Varied aspect ratios for paper pieces
  shimmer: true,                 // New: Subtle shimmer/shine effect
} as const;

/**
 * Default trail configuration
 */
export const DEFAULT_TRAIL: TrailConfig = {
  enabled: false,
  length: 10,
  fade: 0.5,
  width: 0.5,
} as const;

/**
 * Default glow configuration
 */
export const DEFAULT_GLOW: GlowConfig = {
  enabled: false,
  blur: 10,
  color: null,
  intensity: 0.5,
} as const;

/**
 * Default continuous mode configuration
 */
export const DEFAULT_CONTINUOUS: ContinuousConfig = {
  recycle: false,
  numberOfPieces: 200,
  spawnRate: 50,
  run: true,
  tweenDuration: 5000,
} as const;

/**
 * Default firework configuration
 */
export const DEFAULT_FIREWORK: FireworkConfig = {
  secondaryExplosions: true,
  burstCount: 80,
  burstDelay: 500,
  spread: 360,
  launchHeight: 0.6,
  rocketColors: ['#ffd700', '#ff6b35', '#ff0000'],
  burstColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  trailLength: 10,
  riseDuration: 1000,
  showRocket: true,
} as const;

/**
 * Default canvas configuration
 */
export const DEFAULT_CANVAS: CanvasConfig = {
  width: null,
  height: null,
  autoResize: true,
  resizeDebounce: 100,
  frameRate: null,
  pixelRatio: null,
  useWorker: false,
  useOffscreen: false,
} as const;

/**
 * Default accessibility configuration
 */
export const DEFAULT_ACCESSIBILITY = {
  disableForReducedMotion: false,
  ariaLabel: 'Confetti animation',
  ariaHidden: true,
} as const;

/**
 * Complete default configuration
 */
export const DEFAULT_CONFIG: ConfettiBurstConfig = {
  particleCount: 50,
  particle: DEFAULT_PARTICLE,
  physics: DEFAULT_PHYSICS,
  direction: DEFAULT_DIRECTION,
  mode: 'burst',
  easing: 'easeOut',
  zIndex: 9999,
  autoCleanup: true,
  scalar: 1,
  drift: 0,
  flat: false,
} as const;

/**
 * Direction angles in degrees (0 = right, counter-clockwise)
 */
export const DIRECTION_ANGLES: Record<Exclude<import('./types').BurstDirection, 'custom' | 'radial'>, number> = {
  up: 90,
  down: 270,
  left: 180,
  right: 0,
} as const;

/**
 * Pre-calculated values for performance
 */
export const MATH_CONSTANTS = {
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
} as const;

/**
 * Optimization constants for physics calculations
 * Pre-calculated values to avoid repeated computations
 */
export const PHYSICS_OPTIMIZATION = {
  // Taylor series coefficients for fast approximations
  SIN_TAYLOR_COEFF: 0.166667, // 1/6 for sin(x) ≈ x - x³/6
  COS_TAYLOR_COEFF: 0.5,       // 1/2 for cos(x) ≈ 1 - x²/2
  
  // Flutter and sway constants
  FLUTTER_PHASE_SCALE: 0.05,
  SWAY_PHASE_SCALE: 0.03,
  SWAY_FORCE_SCALE: 0.01,
  
  // Physics multipliers
  GRAVITY_TILT_MODIFIER: 0.15,
  FLUTTER_AIR_CATCH_THRESHOLD: 0.7,
  FLUTTER_AIR_CATCH_MULTIPLIER: 0.3,
  ORIENTATION_OPACITY_BASE: 0.7,
  ORIENTATION_OPACITY_SCALE: 0.3,
  
  // Shimmer effect
  SHIMMER_RANGE: 0.3,
  SHIMMER_OFFSET: 0.15,
  
  // Opacity thresholds
  MIN_OPACITY_THRESHOLD: 0.02,
  MIN_SIZE_THRESHOLD: 0.1,
  
  // Velocity variation
  VELOCITY_VARIATION_RANGE: 0.3, // ±15%
  
  // Angular velocity constants
  ANGULAR_DAMPING: 0.98,
  TILT_DAMPING: 0.995,
} as const;

/**
 * Built-in shape names (excluding custom shapes)
 */
type BuiltinShapeName = 
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
  | 'custom';

/**
 * Shape rendering aspect ratios
 */
export const SHAPE_ASPECT_RATIOS: Record<BuiltinShapeName, number> = {
  square: 1,
  circle: 1,
  rectangle: 2,
  triangle: 1,
  star: 1,
  line: 4,
  heart: 1,
  diamond: 1,
  hexagon: 1,
  spiral: 1,
  ribbon: 3,
  custom: 1,
} as const;

/**
 * Default transparent color for fallback
 */
export const TRANSPARENT_COLOR: RGBAColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 0,
} as const;

/**
 * Performance tuning constants
 */
export const PERFORMANCE = {
  /** Maximum particles before reducing quality */
  MAX_PARTICLES: 500,
  /** Frame time budget in ms (targeting 60fps) */
  FRAME_BUDGET: 16.67,
  /** Minimum opacity before particle is considered dead */
  MIN_OPACITY: 0.01,
  /** Minimum size before particle is considered dead */
  MIN_SIZE: 0.5,
  /** Device pixel ratio limit for high-DPI displays */
  MAX_DPR: 2,
} as const;

/**
 * Canvas cleanup delay in milliseconds
 */
export const CLEANUP_DELAY = 100;

/**
 * Star shape points configuration
 */
export const STAR_POINTS = 5;
export const STAR_INNER_RATIO = 0.5;
