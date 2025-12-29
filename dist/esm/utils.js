/**
 * Utility functions for react-confetti-burst
 *
 * Pure utility functions with no side effects.
 * All functions are optimized for performance in animation loops.
 */
import { DEFAULT_CONFIG, DEFAULT_PARTICLE, DEFAULT_PHYSICS, DEFAULT_DIRECTION, DIRECTION_ANGLES, MATH_CONSTANTS, TRANSPARENT_COLOR, } from './constants';
/**
 * Generates a cryptographically secure random number between 0 and 1
 * Falls back to Math.random() if crypto is not available
 */
export function secureRandom() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / (0xFFFFFFFF + 1);
    }
    return Math.random();
}
/**
 * Generates a random number within a range
 */
export function randomInRange(min, max) {
    return min + secureRandom() * (max - min);
}
/**
 * Generates a random integer within a range (inclusive)
 */
export function randomInt(min, max) {
    return Math.floor(randomInRange(min, max + 1));
}
/**
 * Picks a random element from an array
 */
export function randomFromArray(array) {
    if (array.length === 0) {
        throw new Error('Cannot pick from empty array');
    }
    return array[Math.floor(secureRandom() * array.length)];
}
/**
 * Clamps a value between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Linear interpolation between two values
 */
export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}
/**
 * Converts degrees to radians
 */
export function degToRad(degrees) {
    return degrees * MATH_CONSTANTS.DEG_TO_RAD;
}
/**
 * Converts radians to degrees
 */
export function radToDeg(radians) {
    return radians * MATH_CONSTANTS.RAD_TO_DEG;
}
/**
 * Parses a color string to RGBA object
 * Supports: hex (#RGB, #RGBA, #RRGGBB, #RRGGBBAA), rgb(), rgba(), named colors
 */
export function parseColor(color) {
    // Already in RGBA format
    if (typeof color === 'object' && 'r' in color) {
        return {
            r: clamp(Math.round(color.r), 0, 255),
            g: clamp(Math.round(color.g), 0, 255),
            b: clamp(Math.round(color.b), 0, 255),
            a: clamp(color.a, 0, 1),
        };
    }
    // GradientColor - extract first color
    if (typeof color === 'object' && 'type' in color) {
        return parseColor(color.colors[0]);
    }
    const colorStr = color.trim().toLowerCase();
    // Hex colors
    if (colorStr.startsWith('#')) {
        return parseHexColor(colorStr);
    }
    // RGB/RGBA colors
    if (colorStr.startsWith('rgb')) {
        return parseRgbColor(colorStr);
    }
    // Named colors - use canvas to parse
    return parseNamedColor(colorStr);
}
/**
 * Parses hex color strings
 */
function parseHexColor(hex) {
    const cleanHex = hex.slice(1);
    let r, g, b, a = 1;
    switch (cleanHex.length) {
        case 3: // #RGB
            r = parseInt(cleanHex[0] + cleanHex[0], 16);
            g = parseInt(cleanHex[1] + cleanHex[1], 16);
            b = parseInt(cleanHex[2] + cleanHex[2], 16);
            break;
        case 4: // #RGBA
            r = parseInt(cleanHex[0] + cleanHex[0], 16);
            g = parseInt(cleanHex[1] + cleanHex[1], 16);
            b = parseInt(cleanHex[2] + cleanHex[2], 16);
            a = parseInt(cleanHex[3] + cleanHex[3], 16) / 255;
            break;
        case 6: // #RRGGBB
            r = parseInt(cleanHex.slice(0, 2), 16);
            g = parseInt(cleanHex.slice(2, 4), 16);
            b = parseInt(cleanHex.slice(4, 6), 16);
            break;
        case 8: // #RRGGBBAA
            r = parseInt(cleanHex.slice(0, 2), 16);
            g = parseInt(cleanHex.slice(2, 4), 16);
            b = parseInt(cleanHex.slice(4, 6), 16);
            a = parseInt(cleanHex.slice(6, 8), 16) / 255;
            break;
        default:
            return TRANSPARENT_COLOR;
    }
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
        return TRANSPARENT_COLOR;
    }
    return { r, g, b, a };
}
/**
 * Parses rgb() and rgba() color strings
 */
function parseRgbColor(rgb) {
    const match = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (!match) {
        return TRANSPARENT_COLOR;
    }
    return {
        r: clamp(parseInt(match[1], 10), 0, 255),
        g: clamp(parseInt(match[2], 10), 0, 255),
        b: clamp(parseInt(match[3], 10), 0, 255),
        a: match[4] !== undefined ? clamp(parseFloat(match[4]), 0, 1) : 1,
    };
}
/**
 * Parses named colors using a canvas context
 */
function parseNamedColor(name) {
    // Common named colors fallback for SSR
    const namedColors = {
        red: { r: 255, g: 0, b: 0, a: 1 },
        green: { r: 0, g: 128, b: 0, a: 1 },
        blue: { r: 0, g: 0, b: 255, a: 1 },
        white: { r: 255, g: 255, b: 255, a: 1 },
        black: { r: 0, g: 0, b: 0, a: 1 },
        yellow: { r: 255, g: 255, b: 0, a: 1 },
        cyan: { r: 0, g: 255, b: 255, a: 1 },
        magenta: { r: 255, g: 0, b: 255, a: 1 },
        orange: { r: 255, g: 165, b: 0, a: 1 },
        purple: { r: 128, g: 0, b: 128, a: 1 },
        pink: { r: 255, g: 192, b: 203, a: 1 },
    };
    if (namedColors[name]) {
        return namedColors[name];
    }
    // Use canvas for other named colors (browser only)
    if (typeof document !== 'undefined') {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = name;
                ctx.fillRect(0, 0, 1, 1);
                const data = ctx.getImageData(0, 0, 1, 1).data;
                return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
            }
        }
        catch {
            // Canvas not available
        }
    }
    return TRANSPARENT_COLOR;
}
/**
 * Converts RGBA color to CSS string
 */
export function rgbaToString(color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
/**
 * Gets the direction angle in radians for a burst direction
 */
export function getDirectionAngle(direction, customAngle) {
    if (direction === 'custom' && customAngle !== undefined) {
        return degToRad(customAngle);
    }
    if (direction === 'radial') {
        // Random angle for radial burst
        return secureRandom() * MATH_CONSTANTS.TWO_PI;
    }
    const angle = DIRECTION_ANGLES[direction];
    return degToRad(angle ?? 90);
}
/**
 * Calculates the center point of an element
 */
export function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
}
/**
 * Deep merges configuration objects
 */
export function mergeConfig(options) {
    if (!options) {
        return DEFAULT_CONFIG;
    }
    const particle = {
        ...DEFAULT_PARTICLE,
        ...options.particle,
    };
    const physics = {
        ...DEFAULT_PHYSICS,
        ...options.physics,
    };
    const direction = {
        ...DEFAULT_DIRECTION,
        ...options.direction,
    };
    return {
        particleCount: options.particleCount ?? DEFAULT_CONFIG.particleCount,
        particle,
        physics,
        direction,
        mode: options.mode ?? DEFAULT_CONFIG.mode,
        spawnArea: options.spawnArea ? { type: 'rect', x: 0, y: 0, ...options.spawnArea } : undefined,
        continuous: options.continuous,
        firework: options.firework,
        canvas: options.canvas,
        easing: options.easing ?? DEFAULT_CONFIG.easing,
        zIndex: options.zIndex ?? DEFAULT_CONFIG.zIndex,
        autoCleanup: options.autoCleanup ?? DEFAULT_CONFIG.autoCleanup,
        scalar: options.scalar ?? DEFAULT_CONFIG.scalar,
        drift: options.drift ?? DEFAULT_CONFIG.drift,
        flat: options.flat ?? DEFAULT_CONFIG.flat,
        onStart: options.onStart,
        onComplete: options.onComplete,
        onFrame: options.onFrame,
        onParticleCreate: options.onParticleCreate,
        onParticleDeath: options.onParticleDeath,
    };
}
/**
 * Checks if the code is running in a browser environment
 */
export function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Gets the device pixel ratio, capped for performance
 */
export function getDevicePixelRatio(maxDpr = 2) {
    if (!isBrowser())
        return 1;
    return Math.min(window.devicePixelRatio || 1, maxDpr);
}
/**
 * Creates a deferred promise for async control
 */
export function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
/**
 * Validates that a value is within a valid range
 */
export function validateRange(value, min, max, name) {
    if (value < min || value > max) {
        throw new RangeError(`${name} must be between ${min} and ${max}, got ${value}`);
    }
}
/**
 * Calculates distance between two points
 */
export function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Normalizes an angle to be between 0 and 2π
 */
export function normalizeAngle(angle) {
    const twoPi = MATH_CONSTANTS.TWO_PI;
    return ((angle % twoPi) + twoPi) % twoPi;
}
