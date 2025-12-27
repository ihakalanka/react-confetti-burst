"use strict";
/**
 * react-confetti-burst
 *
 * A high-performance, zero-dependency React confetti component
 * with directional bursts using the native Canvas API.
 * Exceeds the feature set of both react-confetti and canvas-confetti.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.confetti = exports.isBrowser = exports.mergeConfig = exports.getElementCenter = exports.getDirectionAngle = exports.radToDeg = exports.degToRad = exports.lerp = exports.clamp = exports.randomFromArray = exports.randomInt = exports.randomInRange = exports.rgbaToString = exports.parseColor = exports.ConfettiButton = exports.ConfettiBurst = exports.useConfetti = exports.forceCleanup = exports.getActiveAnimationCount = exports.fireFromElement = exports.createConfettiExplosion = exports.ConfettiEngine = exports.COLOR_PALETTES = exports.EASING_FUNCTIONS = exports.DIRECTION_ANGLES = exports.DEFAULT_CONFIG = exports.DEFAULT_PARTICLE = exports.DEFAULT_DIRECTION = exports.DEFAULT_PHYSICS = exports.DEFAULT_COLORS = void 0;
// Basic Constants
var constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_COLORS", { enumerable: true, get: function () { return constants_1.DEFAULT_COLORS; } });
Object.defineProperty(exports, "DEFAULT_PHYSICS", { enumerable: true, get: function () { return constants_1.DEFAULT_PHYSICS; } });
Object.defineProperty(exports, "DEFAULT_DIRECTION", { enumerable: true, get: function () { return constants_1.DEFAULT_DIRECTION; } });
Object.defineProperty(exports, "DEFAULT_PARTICLE", { enumerable: true, get: function () { return constants_1.DEFAULT_PARTICLE; } });
Object.defineProperty(exports, "DEFAULT_CONFIG", { enumerable: true, get: function () { return constants_1.DEFAULT_CONFIG; } });
Object.defineProperty(exports, "DIRECTION_ANGLES", { enumerable: true, get: function () { return constants_1.DIRECTION_ANGLES; } });
Object.defineProperty(exports, "EASING_FUNCTIONS", { enumerable: true, get: function () { return constants_1.EASING_FUNCTIONS; } });
Object.defineProperty(exports, "COLOR_PALETTES", { enumerable: true, get: function () { return constants_1.COLOR_PALETTES; } });
// Core engine (Basic)
var confetti_engine_1 = require("./confetti-engine");
Object.defineProperty(exports, "ConfettiEngine", { enumerable: true, get: function () { return confetti_engine_1.ConfettiEngine; } });
Object.defineProperty(exports, "createConfettiExplosion", { enumerable: true, get: function () { return confetti_engine_1.createConfettiExplosion; } });
Object.defineProperty(exports, "fireFromElement", { enumerable: true, get: function () { return confetti_engine_1.fireFromElement; } });
Object.defineProperty(exports, "getActiveAnimationCount", { enumerable: true, get: function () { return confetti_engine_1.getActiveAnimationCount; } });
Object.defineProperty(exports, "forceCleanup", { enumerable: true, get: function () { return confetti_engine_1.forceCleanup; } });
// Basic React hooks
var hooks_1 = require("./hooks");
Object.defineProperty(exports, "useConfetti", { enumerable: true, get: function () { return hooks_1.useConfetti; } });
// Basic React components
var components_1 = require("./components");
Object.defineProperty(exports, "ConfettiBurst", { enumerable: true, get: function () { return components_1.ConfettiBurst; } });
Object.defineProperty(exports, "ConfettiButton", { enumerable: true, get: function () { return components_1.ConfettiButton; } });
// Basic Utility functions
var utils_1 = require("./utils");
Object.defineProperty(exports, "parseColor", { enumerable: true, get: function () { return utils_1.parseColor; } });
Object.defineProperty(exports, "rgbaToString", { enumerable: true, get: function () { return utils_1.rgbaToString; } });
Object.defineProperty(exports, "randomInRange", { enumerable: true, get: function () { return utils_1.randomInRange; } });
Object.defineProperty(exports, "randomInt", { enumerable: true, get: function () { return utils_1.randomInt; } });
Object.defineProperty(exports, "randomFromArray", { enumerable: true, get: function () { return utils_1.randomFromArray; } });
Object.defineProperty(exports, "clamp", { enumerable: true, get: function () { return utils_1.clamp; } });
Object.defineProperty(exports, "lerp", { enumerable: true, get: function () { return utils_1.lerp; } });
Object.defineProperty(exports, "degToRad", { enumerable: true, get: function () { return utils_1.degToRad; } });
Object.defineProperty(exports, "radToDeg", { enumerable: true, get: function () { return utils_1.radToDeg; } });
Object.defineProperty(exports, "getDirectionAngle", { enumerable: true, get: function () { return utils_1.getDirectionAngle; } });
Object.defineProperty(exports, "getElementCenter", { enumerable: true, get: function () { return utils_1.getElementCenter; } });
Object.defineProperty(exports, "mergeConfig", { enumerable: true, get: function () { return utils_1.mergeConfig; } });
Object.defineProperty(exports, "isBrowser", { enumerable: true, get: function () { return utils_1.isBrowser; } });
// Basic Functional API
var confetti_1 = require("./confetti");
Object.defineProperty(exports, "confetti", { enumerable: true, get: function () { return confetti_1.confetti; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return confetti_1.confetti; } });
// ============================================================================
// v1.1.0 - REACT HOOKS (Uncomment when releasing)
// ============================================================================
/*
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
*/
// ============================================================================
// v1.2.0 - BUILT-IN PRESETS (Uncomment when releasing)
// ============================================================================
/*
export type {
  PresetName,
  PresetConfig,
} from './types';

export {
  PRESETS,
  getPreset,
} from './constants';
*/
// ============================================================================
// v1.3.0 - CANVAS-CONFETTI API (Uncomment when releasing)
// ============================================================================
/*
export type {
  NormalizedOrigin,
  AccessibilityConfig,
  CanvasConfettiOptions,
  ConfettiCreateOptions,
  CanvasConfig,
  ConfettiProps,
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
*/
// ============================================================================
// v1.4.0 - CUSTOM SHAPES (Uncomment when releasing)
// ============================================================================
/*
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
} from './constants';

export {
  shapeFromPath,
  shapeFromText,
  shapeFromImage,
  shapesFromEmoji,
  pathShapes,
  emojiShapes,
} from './shapes';

export type {
  ShapeFromPathOptions,
  ShapeFromTextOptions,
} from './shapes';
*/
// ============================================================================
// v1.5.0 - ADVANCED EFFECTS (Uncomment when releasing)
// ============================================================================
/*
export type {
  EffectMode,
  SpawnArea,
  TrailConfig,
  GlowConfig,
  ImageParticle,
  ContinuousConfig,
  FireworkConfig,
} from './types';

export {
  DEFAULT_TRAIL,
  DEFAULT_GLOW,
  DEFAULT_CONTINUOUS,
  DEFAULT_FIREWORK,
} from './constants';
*/
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
//# sourceMappingURL=index.js.map