/**
 * Shape helper functions
 *
 * Provides canvas-confetti compatible shape creation utilities
 * for custom SVG paths, text, and emoji shapes.
 *
 * @module shapes
 */
import type { PathShape, TextShape, CustomShape } from './types';
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
export declare function shapeFromPath(options: ShapeFromPathOptions): PathShape;
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
export declare function shapeFromText(options: ShapeFromTextOptions): TextShape;
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
export declare function shapeFromImage(options: {
    readonly src: string | HTMLImageElement;
    readonly width?: number;
    readonly height?: number;
    readonly scalar?: number;
}): Promise<CustomShape>;
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
export declare function shapesFromEmoji(emojis: readonly string[], options?: Omit<ShapeFromTextOptions, 'text'>): TextShape[];
/**
 * Common predefined path shapes
 */
export declare const pathShapes: {
    /** Five-pointed star */
    star: PathShape;
    /** Heart shape */
    heart: PathShape;
    /** Diamond shape */
    diamond: PathShape;
    /** Hexagon shape */
    hexagon: PathShape;
    /** Triangle shape */
    triangle: PathShape;
    /** Plus/cross shape */
    plus: PathShape;
    /** Moon/crescent shape */
    moon: PathShape;
    /** Lightning bolt */
    lightning: PathShape;
    /** Spiral shape */
    spiral: PathShape;
    /** Ribbon/wave shape */
    ribbon: PathShape;
};
/**
 * Common emoji sets for quick use
 */
export declare const emojiShapes: {
    /** Party/celebration emoji */
    party: TextShape[];
    /** Heart emoji */
    hearts: TextShape[];
    /** Star emoji */
    stars: TextShape[];
    /** Nature emoji */
    nature: TextShape[];
    /** Food emoji */
    food: TextShape[];
    /** Sports emoji */
    sports: TextShape[];
    /** Weather emoji */
    weather: TextShape[];
    /** Money emoji */
    money: TextShape[];
    /** Animals emoji */
    animals: TextShape[];
    /** Holiday emoji */
    holiday: TextShape[];
};
