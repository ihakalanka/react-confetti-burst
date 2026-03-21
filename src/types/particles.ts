/**
 * Particle state and configuration types
 */

import type { RGBAColor, TrailPosition } from './core';
import type { ParticleShape, CustomShape } from './shapes';

/**
 * Custom draw function context
 */
export interface DrawContext {
  readonly ctx: CanvasRenderingContext2D;
  readonly particle: ParticleState;
  readonly progress: number;
  readonly elapsed: number;
}

/**
 * Custom draw function type
 */
export type CustomDrawFunction = (context: DrawContext) => void;

/**
 * Image/Emoji particle configuration
 */
export interface ImageParticle {
  readonly src: string;
  readonly isEmoji: boolean;
  readonly scale?: number;
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
  image?: ImageParticle;
  imageElement?: HTMLImageElement | null;
  trail: TrailPosition[];
  wobblePhase: number;
  wobbleSpeed: number;
  tilt: number;
  tiltSpeed: number;
  depth: number;
  hasExploded: boolean;
  data: Record<string, unknown>;
  flutterPhase: number;
  flutterSpeed: number;
  swayPhase: number;
  aspectRatio: number;
  angularVelocity: number;
  scaleX: number;
  scaleY: number;
  shimmerPhase: number;
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
