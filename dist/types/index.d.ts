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
export type { Point, Vector2D, RGBAColor, GradientColor, ColorInput, ParticleShape, BurstDirection, EasingFunction, EasingPreset, PhysicsConfig, DirectionConfig, ParticleConfig, ConfettiBurstConfig, ConfettiBurstOptions, BurstOrigin, ParticleState, AnimationState, CanvasContext, ExplosionHandle, UseConfettiReturn, ConfettiBurstProps, ConfettiButtonProps, } from './types';
export { DEFAULT_COLORS, DEFAULT_PHYSICS, DEFAULT_DIRECTION, DEFAULT_PARTICLE, DEFAULT_CONFIG, DIRECTION_ANGLES, EASING_FUNCTIONS, COLOR_PALETTES, } from './constants';
export { ConfettiEngine, createConfettiExplosion, fireFromElement, getActiveAnimationCount, forceCleanup, } from './confetti-engine';
export { useConfetti, } from './hooks';
export { ConfettiBurst, ConfettiButton, } from './components';
export { parseColor, rgbaToString, randomInRange, randomInt, randomFromArray, clamp, lerp, degToRad, radToDeg, getDirectionAngle, getElementCenter, mergeConfig, isBrowser, } from './utils';
export { confetti, confetti as default } from './confetti';
