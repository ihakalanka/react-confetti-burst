/**
 * Shape-related types
 */

import type { PathBounds } from './core';

/**
 * Custom shape created from SVG path (canvas-confetti compatible)
 */
export interface PathShape {
  readonly type: 'path';
  readonly path: string;
  readonly matrix?: DOMMatrix | readonly number[];
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly strokeWidth?: number;
  readonly bounds?: PathBounds;
  readonly _path2D?: Path2D;
}

/**
 * Custom shape created from text/emoji (canvas-confetti compatible)
 */
export interface TextShape {
  readonly type: 'text';
  readonly text: string;
  readonly scalar?: number;
  readonly color?: string;
  readonly fontFamily?: string;
  readonly fontWeight?: string;
  readonly fontStyle?: 'normal' | 'italic' | 'oblique';
  readonly _bitmap?: ImageBitmap | HTMLCanvasElement;
}

/**
 * Custom shape union type
 */
export type CustomShape = PathShape | TextShape;

/**
 * Shape types for confetti particles
 */
export type ParticleShape =
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
  | 'custom'
  | CustomShape;

/**
 * Shape input (string or custom shape object)
 */
export type ShapeInput = Exclude<ParticleShape, CustomShape> | CustomShape;
