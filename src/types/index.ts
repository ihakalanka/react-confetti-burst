/**
 * Type barrel re-exports
 *
 * All types are organized into focused modules but re-exported
 * from here for backwards compatibility.
 */

export type {
  Point,
  NormalizedOrigin,
  Vector2D,
  RGBAColor,
  GradientColor,
  ColorInput,
  PathBounds,
  BurstOrigin,
  TrailPosition,
  EasingFunction,
  EasingPreset,
  BurstDirection,
  EffectMode,
  SpawnAreaType,
} from './core';

export type {
  PathShape,
  TextShape,
  ImageShape,
  CustomShape,
  ParticleShape,
  ShapeInput,
} from './shapes';

export type {
  DrawContext,
  CustomDrawFunction,
  ImageParticle,
  ParticleState,
  AnimationState,
  CanvasContext,
} from './particles';

export type {
  PhysicsConfig,
  DirectionConfig,
  SpawnArea,
} from './physics';

export type {
  TrailConfig,
  GlowConfig,
  ContinuousConfig,
  FireworkConfig,
  CanvasConfig,
  AccessibilityConfig,
} from './effects';

export type {
  ParticleConfig,
  ConfettiBurstConfig,
  ConfettiBurstOptions,
  CanvasConfettiOptions,
  ConfettiCreateOptions,
  ExplosionHandle,
  ConfettiInstance,
  ConfettiFunction,
} from './config';

export type {
  UseConfettiReturn,
  ConfettiBurstProps,
  ConfettiButtonProps,
  ConfettiProps,
  PresetName,
  PresetConfig,
} from './ui';
