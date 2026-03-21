/**
 * Physics and direction configuration types
 */

import type { SpawnAreaType } from './core';

/**
 * Configuration for particle physics behavior
 */
export interface PhysicsConfig {
  readonly gravity: number;
  readonly drag: number;
  readonly friction: number;
  readonly rotationSpeed: number;
  readonly wind: number;
  readonly windVariation: number;
  readonly tumble: boolean;
  readonly decay: number;
  readonly bounce: number;
  readonly floor: number | null;
  readonly wobble: boolean;
  readonly wobbleSpeed: number;
  readonly flutter?: boolean;
  readonly flutterSpeed?: number;
  readonly flutterIntensity?: number;
  readonly airResistance?: number;
  readonly swayAmplitude?: number;
  readonly swayFrequency?: number;
}

/**
 * Configuration for the burst direction and spread
 */
export interface DirectionConfig {
  readonly direction: import('./core').BurstDirection;
  readonly angle?: number;
  readonly spread: number;
  readonly velocity: readonly [number, number];
  readonly initialVelocityX?: { readonly min: number; readonly max: number } | number;
  readonly initialVelocityY?: { readonly min: number; readonly max: number } | number;
  readonly velocityDecay?: number;
}

/**
 * Spawn area configuration
 */
export interface SpawnArea {
  readonly type: SpawnAreaType;
  readonly x: number;
  readonly y: number;
  readonly w?: number;
  readonly h?: number;
  readonly width?: number;
  readonly height?: number;
}
