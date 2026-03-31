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
 * Custom shape created from an image (URL or HTMLImageElement)
 */
export interface ImageShape {
  readonly type: 'image';
  /** Image source URL */
  readonly src: string;
  /** Pre-loaded image element */
  readonly image?: HTMLImageElement;
  /** Scale factor. Default: 1 */
  readonly scalar?: number;
  /** Display width */
  readonly width?: number;
  /** Display height */
  readonly height?: number;
}

/**
 * Custom shape union type
 */
export type CustomShape = PathShape | TextShape | ImageShape;

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
