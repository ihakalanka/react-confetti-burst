/**
 * Shape helper functions
 *
 * Provides canvas-confetti compatible shape creation utilities
 * for custom SVG paths, text, and emoji shapes.
 *
 * @module shapes
 */
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
export function shapeFromPath(options) {
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
export function shapeFromText(options) {
    const { text, scalar = 1, color, fontFamily = 'serif', fontWeight = 'normal', fontStyle = 'normal', } = options;
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
export async function shapeFromImage(options) {
    const { src, scalar = 1 } = options;
    // If it's already an image element, use it directly
    if (typeof src !== 'string') {
        return {
            type: 'text', // Reuse text type for simplicity in renderer
            text: '',
            scalar,
            // Store image reference in a custom way
            fontFamily: `url(${src.src})`,
        };
    }
    // Load the image to validate it exists
    await loadImage(src);
    return {
        type: 'text',
        text: '',
        scalar,
        fontFamily: `url(${src})`,
        color: undefined,
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
export function shapesFromEmoji(emojis, options = {}) {
    return emojis.map(emoji => shapeFromText({ ...options, text: emoji }));
}
/**
 * Common predefined path shapes
 */
export const pathShapes = {
    /** Five-pointed star */
    star: shapeFromPath({
        path: 'M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z',
    }),
    /** Heart shape */
    heart: shapeFromPath({
        path: 'M0,0.8 C-0.5,0.4 -1,-0.2 -1,-0.6 C-1,-1 -0.5,-1.2 0,-0.8 C0.5,-1.2 1,-1 1,-0.6 C1,-0.2 0.5,0.4 0,0.8 Z',
    }),
    /** Diamond shape */
    diamond: shapeFromPath({
        path: 'M0,-1 L0.7,0 L0,1 L-0.7,0 Z',
    }),
    /** Hexagon shape */
    hexagon: shapeFromPath({
        path: 'M0.866,-0.5 L0.866,0.5 L0,1 L-0.866,0.5 L-0.866,-0.5 L0,-1 Z',
    }),
    /** Triangle shape */
    triangle: shapeFromPath({
        path: 'M0,-1 L0.866,0.5 L-0.866,0.5 Z',
    }),
    /** Plus/cross shape */
    plus: shapeFromPath({
        path: 'M-0.25,-1 L0.25,-1 L0.25,-0.25 L1,-0.25 L1,0.25 L0.25,0.25 L0.25,1 L-0.25,1 L-0.25,0.25 L-1,0.25 L-1,-0.25 L-0.25,-0.25 Z',
    }),
    /** Moon/crescent shape */
    moon: shapeFromPath({
        path: 'M0,-1 A1,1 0 1,1 0,1 A0.6,0.6 0 1,0 0,-1 Z',
    }),
    /** Lightning bolt */
    lightning: shapeFromPath({
        path: 'M0.4,-1 L-0.2,0 L0.2,0 L-0.4,1 L0,0.2 L-0.3,0.2 L0.4,-1 Z',
    }),
    /** Spiral shape */
    spiral: shapeFromPath({
        path: 'M0,0 Q0.3,-0.3 0,-0.5 Q-0.5,-0.5 -0.5,0 Q-0.5,0.7 0,0.7 Q0.7,0.7 0.7,0 Q0.7,-0.9 0,-0.9',
    }),
    /** Ribbon/wave shape */
    ribbon: shapeFromPath({
        path: 'M-1,0 Q-0.5,-0.5 0,0 Q0.5,0.5 1,0 Q0.5,-0.3 0,0 Q-0.5,0.3 -1,0 Z',
    }),
};
/**
 * Common emoji sets for quick use
 */
export const emojiShapes = {
    /** Party/celebration emoji */
    party: shapesFromEmoji(['🎉', '🎊', '🥳', '✨', '🎈']),
    /** Heart emoji */
    hearts: shapesFromEmoji(['❤️', '💕', '💖', '💗', '💝']),
    /** Star emoji */
    stars: shapesFromEmoji(['⭐', '🌟', '✨', '💫', '🌠']),
    /** Nature emoji */
    nature: shapesFromEmoji(['🌸', '🌺', '🌻', '🌼', '🌷']),
    /** Food emoji */
    food: shapesFromEmoji(['🍕', '🍔', '🍟', '🍩', '🧁']),
    /** Sports emoji */
    sports: shapesFromEmoji(['⚽', '🏀', '🏈', '⚾', '🎾']),
    /** Weather emoji */
    weather: shapesFromEmoji(['☀️', '⛅', '🌈', '❄️', '💨']),
    /** Money emoji */
    money: shapesFromEmoji(['💰', '💵', '💎', '🪙', '💳']),
    /** Animals emoji */
    animals: shapesFromEmoji(['🦋', '🐝', '🐞', '🦄', '🐱']),
    /** Holiday emoji */
    holiday: shapesFromEmoji(['🎄', '🎃', '🎅', '🐰', '🦃']),
};
// ============================================================================
// Internal helper functions
// ============================================================================
/**
 * Parse SVG path and extract bounds for proper scaling
 */
function getPathBounds(path) {
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
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}
//# sourceMappingURL=shapes.js.map