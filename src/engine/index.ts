/**
 * Engine Module Exports
 * 
 * @module engine
 */

// Interfaces
export type {
  IDelta,
  ICoordinates,
  INormalizedOrigin,
  IRangeValue,
  IParticleTransformValues,
  IParticleWobble,
  IParticleTilt,
  IParticleRoll,
  IParticleRotate,
  IParticleUpdater,
  IParticleMover,
  IShapeDrawer,
  IParticle,
  IContainerOptions,
  IConfettiOptions,
  IContainer,
  IEngine,
} from './interfaces';

// Core classes
export { Particle, ParticlePool } from './Particle';
export { Container } from './Container';
export { Engine, getEngine, resetEngine } from './Engine';

// Updaters
export {
  BaseUpdater,
  WobbleUpdater,
  TiltUpdater,
  RollUpdater,
  RotateUpdater,
  OpacityUpdater,
  createDefaultUpdaters,
} from './updaters';

// Shapes
export {
  CircleDrawer,
  SquareDrawer,
  RectangleDrawer,
  StarDrawer,
  TriangleDrawer,
  DiamondDrawer,
  HeartDrawer,
  HexagonDrawer,
  ShapeRegistry,
  defaultShapeRegistry,
} from './shapes';

// Utilities
export {
  getRandom,
  getRangeValue,
  degToRad,
  radToDeg,
  clamp,
  lerp,
  normalizeAngle,
  calculateDelta,
  parseColor,
  adjustColorBrightness,
  prefersReducedMotion,
  generateId,
  resetIdCounter,
  pickRandom,
  freeze,
  deepClone,
  sanitizeOptions,
  requestFrame,
  cancelFrame,
  getPixelRatio,
} from './utils';
