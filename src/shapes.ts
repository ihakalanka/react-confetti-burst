/**
 * Shape helper functions
 * 
 * Provides canvas-confetti compatible shape creation utilities
 * for custom SVG paths, text, and emoji shapes.
 * 
 * @module shapes
 */

import type { PathShape, TextShape, ImageShape } from './types';

/**
 * Options for creating a shape from an SVG path
 */
export interface ShapeFromPathOptions {
  /** SVG path string (d attribute) */
  readonly path: string;
  /** Optional 2D transformation matrix [a, b, c, d, e, f] */
  readonly matrix?: readonly number[];
  /** Fill color (optional, will use particle color if not set) */
  readonly fillColor?: string;
  /** Stroke color (optional) */
  readonly strokeColor?: string;
  /** Stroke width (optional) */
  readonly strokeWidth?: number;
}

/**
 * Options for creating a shape from text/emoji
 */
export interface ShapeFromTextOptions {
  /** Text or emoji to render */
  readonly text: string;
  /** Scale factor for the text size. Default: 1 */
  readonly scalar?: number;
  /** Text color (optional, will use particle color if not set) */
  readonly color?: string;
  /** Font family. Default: 'serif' */
  readonly fontFamily?: string;
  /** Font weight. Default: 'normal' */
  readonly fontWeight?: string | number;
  /** Font style. Default: 'normal' */
  readonly fontStyle?: 'normal' | 'italic' | 'oblique';
}

/**
 * Create a custom shape from an SVG path string.
 * 
 * This is compatible with canvas-confetti's shapeFromPath function.
 * 
 * @example
 * ```typescript
 * // Simple star shape
 * const star = shapeFromPath({
 *   path: 'M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z'
 * });
 * 
 * // With transformation matrix
 * const scaledStar = shapeFromPath({
 *   path: 'M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z',
 *   matrix: [2, 0, 0, 2, 0, 0] // Scale 2x
 * });
 * 
 * // Usage with confetti
 * fire({ x: 0.5, y: 0.5 }, {
 *   particle: { shapes: [star, 'circle'] }
 * });
 * ```
 * 
 * @param options - Shape configuration options
 * @returns PathShape object for use in confetti configuration
 */
export function shapeFromPath(options: ShapeFromPathOptions): PathShape {
  const { path, matrix, fillColor, strokeColor, strokeWidth } = options;
  
  // Parse the path to extract bounds for proper scaling
  const bounds = getPathBounds(path);
  
  return {
    type: 'path',
    path,
    matrix: matrix ? [...matrix] : undefined,
    fillColor,
    strokeColor,
    strokeWidth,
    bounds,
  };
}

/**
 * Create a custom shape from text or an emoji.
 * 
 * This is compatible with canvas-confetti's shapeFromText function.
 * 
 * @example
 * ```typescript
 * // Emoji confetti
 * const heart = shapeFromText({ text: '❤️' });
 * const party = shapeFromText({ text: '🎉', scalar: 2 });
 * 
 * // Custom text
 * const yay = shapeFromText({
 *   text: 'YAY',
 *   fontFamily: 'Impact',
 *   color: '#ff0000'
 * });
 * 
 * // Usage with confetti
 * fire({ x: 0.5, y: 0.5 }, {
 *   particle: { shapes: [heart, party, yay] }
 * });
 * ```
 * 
 * @param options - Text shape configuration options
 * @returns TextShape object for use in confetti configuration
 */
export function shapeFromText(options: ShapeFromTextOptions): TextShape {
  const {
    text,
    scalar = 1,
    color,
    fontFamily = 'serif',
    fontWeight = 'normal',
    fontStyle = 'normal',
  } = options;
  
  return {
    type: 'text',
    text,
    scalar,
    color,
    fontFamily,
    fontWeight: String(fontWeight),
    fontStyle,
  };
}

/**
 * Create a bitmap shape from an image URL or HTMLImageElement.
 * 
 * @example
 * ```typescript
 * const logo = await shapeFromImage({
 *   src: '/logo.png',
 *   width: 32,
 *   height: 32
 * });
 * 
 * fire({ x: 0.5, y: 0.5 }, {
 *   particle: { shapes: [logo] }
 * });
 * ```
 * 
 * @param options - Image shape configuration options
 * @returns Promise resolving to a custom shape
 */
export async function shapeFromImage(options: {
  readonly src: string | HTMLImageElement;
  readonly width?: number;
  readonly height?: number;
  readonly scalar?: number;
}): Promise<ImageShape> {
  const { src, width, height, scalar = 1 } = options;
  
  // If it's already an image element, use it directly
  if (typeof src !== 'string') {
    return {
      type: 'image',
      src: src.src,
      image: src,
      scalar,
      width,
      height,
    };
  }
  
  // Load the image to validate it exists
  const image = await loadImage(src);
  
  return {
    type: 'image',
    src,
    image,
    scalar,
    width,
    height,
  };
}

/**
 * Create multiple shapes from an array of emoji.
 * 
 * @example
 * ```typescript
 * const partyEmoji = shapesFromEmoji(['🎉', '🎊', '✨', '🥳']);
 * 
 * fire({ x: 0.5, y: 0.5 }, {
 *   particle: { shapes: partyEmoji }
 * });
 * ```
 * 
 * @param emojis - Array of emoji strings
 * @param options - Optional common options for all emoji
 * @returns Array of TextShape objects
 */
export function shapesFromEmoji(
  emojis: readonly string[],
  options: Omit<ShapeFromTextOptions, 'text'> = {}
): TextShape[] {
  return emojis.map(emoji => shapeFromText({ ...options, text: emoji }));
}

// ============================================================================
// Internal helper functions
// ============================================================================

/**
 * Parse SVG path and extract bounds for proper scaling
 */
function getPathBounds(path: string): { minX: number; minY: number; maxX: number; maxY: number } {
  // Simple bounds extraction - this is a basic implementation
  // A full implementation would parse all path commands
  const numbers = path.match(/-?\d*\.?\d+/g);
  
  if (!numbers || numbers.length < 2) {
    return { minX: -1, minY: -1, maxX: 1, maxY: 1 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  // Assume alternating x,y pairs (simplified)
  for (let i = 0; i < numbers.length - 1; i += 2) {
    const x = parseFloat(numbers[i]);
    const y = parseFloat(numbers[i + 1]);
    
    if (!isNaN(x) && !isNaN(y)) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  
  // Handle case where we couldn't parse valid bounds
  if (!isFinite(minX)) {
    return { minX: -1, minY: -1, maxX: 1, maxY: 1 };
  }
  
  return { minX, minY, maxX, maxY };
}

/**
 * Load an image and return a promise
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
