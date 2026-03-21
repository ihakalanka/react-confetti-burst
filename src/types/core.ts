/**
 * Core primitive types
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
  readonly x: number;
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
 * Origin point for the burst
 */
export interface BurstOrigin {
  readonly x: number;
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
  | 'burst'
  | 'continuous'
  | 'firework'
  | 'snow'
  | 'cannon'
  | 'fountain'
  | 'rain'
  | 'explosion';

/**
 * Spawn area type
 */
export type SpawnAreaType = 'point' | 'rect' | 'line' | 'circle';
