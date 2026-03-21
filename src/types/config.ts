/**
 * Main configuration types
 */

import type { EasingPreset, EffectMode, ColorInput } from './core';
import type { ParticleShape, ShapeInput } from './shapes';
import type { ParticleState, CustomDrawFunction, ImageParticle } from './particles';
import type { PhysicsConfig, DirectionConfig, SpawnArea } from './physics';
import type { TrailConfig, GlowConfig, ContinuousConfig, FireworkConfig, CanvasConfig, AccessibilityConfig } from './effects';

/**
 * Configuration for individual particles
 */
export interface ParticleConfig {
  readonly colors: readonly ColorInput[];
  readonly shapes: readonly ParticleShape[];
  readonly size: readonly [number, number];
  readonly opacity: readonly [number, number];
  readonly lifespan: number;
  readonly fadeOut: boolean;
  readonly scaleDown: boolean;
  readonly drawShape?: CustomDrawFunction;
  readonly images?: readonly ImageParticle[];
  readonly trail?: Partial<TrailConfig>;
  readonly glow?: Partial<GlowConfig>;
  readonly spin: boolean;
  readonly spinSpeed: readonly [number, number];
  readonly tilt: readonly [number, number];
  readonly depth3D: number;
  readonly aspectRatio?: readonly [number, number];
  readonly shimmer?: boolean;
}

/**
 * Main configuration for the confetti burst
 */
export interface ConfettiBurstConfig {
  readonly particleCount: number;
  readonly particle: ParticleConfig;
  readonly physics: PhysicsConfig;
  readonly direction: DirectionConfig;
  readonly mode: EffectMode;
  readonly spawnArea?: SpawnArea;
  readonly continuous?: Partial<ContinuousConfig>;
  readonly firework?: Partial<FireworkConfig>;
  readonly canvas?: Partial<CanvasConfig>;
  readonly accessibility?: Partial<AccessibilityConfig>;
  readonly easing: EasingPreset;
  readonly zIndex: number;
  readonly autoCleanup: boolean;
  readonly scalar: number;
  readonly drift: number;
  readonly ticks?: number;
  readonly flat: boolean;
  readonly onStart?: () => void;
  readonly onComplete?: () => void;
  readonly onFrame?: (particleCount: number) => void;
  readonly onParticleCreate?: (particle: ParticleState) => void;
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
 * canvas-confetti compatible options
 */
export interface CanvasConfettiOptions {
  readonly particleCount?: number;
  readonly size?: number;
  readonly angle?: number;
  readonly spread?: number;
  readonly startVelocity?: number;
  readonly decay?: number;
  readonly gravity?: number;
  readonly drift?: number;
  readonly flat?: boolean;
  readonly ticks?: number;
  readonly origin?: import('./core').NormalizedOrigin;
  readonly colors?: readonly string[];
  readonly shapes?: readonly ShapeInput[];
  readonly scalar?: number;
  readonly zIndex?: number;
  readonly disableForReducedMotion?: boolean;
}

/**
 * Global options for confetti.create()
 */
export interface ConfettiCreateOptions {
  readonly resize?: boolean;
  readonly useWorker?: boolean;
  readonly disableForReducedMotion?: boolean;
}

/**
 * Result from the explosion trigger function
 */
export interface ExplosionHandle {
  readonly stop: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly addParticles: (count: number) => void;
  readonly clear: () => void;
  readonly getParticleCount: () => number;
  readonly getState: () => 'running' | 'paused' | 'stopped';
  readonly promise: Promise<void>;
}
