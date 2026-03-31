/**
 * react-confetti-burst
 * 
 * A high-performance, zero-dependency React confetti component
 * with directional bursts using the native Canvas API.
 * Exceeds the feature set of both react-confetti and canvas-confetti.
 * 
 * @packageDocumentation
 */

/**
 * ============================================================================
 * FEATURE RELEASE FLAGS
 * ============================================================================
 * 
 * Uncomment features as they are released:
 * 
 * v1.0.0 - Basic Usage (ConfettiButton, useConfetti, basic confetti())
 * v1.1.0 - React Hooks (useConfettiTrigger, useConfettiSequence, useConfettiCenter)
 * v1.2.0 - Built-in Presets (16 presets)
 * v1.3.0 - canvas-confetti API (confetti.create, confetti.reset)
 * v1.4.0 - Custom Shapes (shapeFromPath, shapeFromText, shapesFromEmoji)
 * v1.5.0 - Advanced Effects (trails, glow, fireworks, continuous mode)
 * v1.6.0 - Full Feature Set
 * 
 * ============================================================================
 */

// ============================================================================
// v1.0.0 - BASIC USAGE (Currently Released)
// ============================================================================

// Core Types (Basic)
export type {
  // Core types
  Point,
  Vector2D,
  RGBAColor,
  GradientColor,
  ColorInput,
  ParticleShape,
  BurstDirection,
  EasingFunction,
  EasingPreset,
  
  // Configuration types
  PhysicsConfig,
  DirectionConfig,
  ParticleConfig,
  ConfettiBurstConfig,
  ConfettiBurstOptions,
  BurstOrigin,
  
  // State types
  ParticleState,
  AnimationState,
  CanvasContext,
  
  // Handle types
  ExplosionHandle,
  UseConfettiReturn,
  
  // Component props
  ConfettiBurstProps,
  ConfettiButtonProps,
} from './types';

// Basic Constants (only essentials for smaller bundle)
export {
  DEFAULT_COLORS,
  DEFAULT_PHYSICS,
  DEFAULT_DIRECTION,
  DEFAULT_PARTICLE,
  DEFAULT_CONFIG,
  DIRECTION_ANGLES,
  // COLOR_PALETTES moved to presets for tree-shaking
} from './constants';

// Easing functions (separated for tree-shaking)
export { EASING_FUNCTIONS } from './easing';

// Core engine (Basic)
export {
  ConfettiEngine,
  createConfettiExplosion,
  fireFromElement,
  getActiveAnimationCount,
  forceCleanup,
  setMaxPoolSize,
  getMaxPoolSize,
} from './confetti-engine';

// Basic React hooks
export {
  useConfetti,
} from './hooks';

// Basic React components
export {
  ConfettiBurst,
  ConfettiButton,
} from './components';

// Basic Utility functions
export {
  parseColor,
  rgbaToString,
  randomInRange,
  randomInt,
  randomFromArray,
  clamp,
  lerp,
  degToRad,
  radToDeg,
  getDirectionAngle,
  getElementCenter,
  mergeConfig,
  isBrowser,
} from './utils';

// Basic Functional API
export { confetti, confetti as default } from './confetti';

// ============================================================================
// v1.1.0 - REACT HOOKS
// ============================================================================

export {
  useConfettiTrigger,
  useConfettiOnCondition,
  useConfettiSequence,
  useConfettiCenter,
} from './hooks';

export {
  ConfettiTrigger,
} from './components';

export type { ConfettiTriggerHandle } from './components';

// ============================================================================
// v1.2.0 - BUILT-IN PRESETS (Currently Released)
// ============================================================================

export type {
  PresetName,
  PresetConfig,
} from './types';

// Re-export presets module for tree-shaking
export * from './presets';

// ============================================================================
// v1.3.0 - CANVAS-CONFETTI API
// ============================================================================

export type {
  NormalizedOrigin,
  AccessibilityConfig,
  CanvasConfettiOptions,
  ConfettiCreateOptions,
  CanvasConfig,
  ConfettiProps,
  ConfettiFunction,
  ConfettiInstance,
} from './types';

export {
  DEFAULT_CANVAS,
  DEFAULT_ACCESSIBILITY,
} from './constants';

export {
  ConfettiOnMount,
  ConfettiCannon,
  Confetti,
} from './components';

export type { ConfettiComponentProps } from './components';

// ============================================================================
// v1.4.0 - CUSTOM SHAPES (Uncomment when releasing)
// ============================================================================

export type {
  DrawContext,
  CustomDrawFunction,
  PathShape,
  TextShape,
  CustomShape,
  ShapeInput,
  PathBounds,
} from './types';

export {
  EMOJI_SETS,
} from './presets';

export {
  shapeFromPath,
  shapeFromText,
  shapeFromImage,
  shapesFromEmoji,
} from './shapes';

/*
// Predefined shapes and emoji sets are available for import from './shapes-data'
// to enable tree-shaking for applications that don't use them
export {
  pathShapes,
  emojiShapes,
} from './shapes-data';
*/

export type {
  ShapeFromPathOptions,
  ShapeFromTextOptions,
} from './shapes';

// ============================================================================
// v1.5.0 - ADVANCED EFFECTS
// ============================================================================

export type {
  EffectMode,
  SpawnArea,
  TrailConfig,
  GlowConfig,
  ImageParticle,
  ContinuousConfig,
  FireworkConfig,
  ImageShape,
} from './types';

export {
  DEFAULT_TRAIL,
  DEFAULT_GLOW,
  DEFAULT_CONTINUOUS,
  DEFAULT_FIREWORK,
} from './constants';

// ============================================================================
// v1.6.0 - PARTICLE UTILITIES (Uncomment when releasing)
// ============================================================================

/*
export {
  createParticle,
  updateParticle,
  renderParticle,
  areAllParticlesInactive,
  countActiveParticles,
  loadImage,
  clearImageCache,
} from './particle';
*/
