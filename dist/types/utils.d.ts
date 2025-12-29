/**
 * Utility functions for react-confetti-burst
 *
 * Pure utility functions with no side effects.
 * All functions are optimized for performance in animation loops.
 */
import type { RGBAColor, ColorInput, ConfettiBurstConfig, ConfettiBurstOptions, BurstDirection, Point } from './types';
/**
 * Generates a cryptographically secure random number between 0 and 1
 * Falls back to Math.random() if crypto is not available
 */
export declare function secureRandom(): number;
/**
 * Generates a random number within a range
 */
export declare function randomInRange(min: number, max: number): number;
/**
 * Generates a random integer within a range (inclusive)
 */
export declare function randomInt(min: number, max: number): number;
/**
 * Picks a random element from an array
 */
export declare function randomFromArray<T>(array: readonly T[]): T;
/**
 * Clamps a value between min and max
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Linear interpolation between two values
 */
export declare function lerp(start: number, end: number, t: number): number;
/**
 * Converts degrees to radians
 */
export declare function degToRad(degrees: number): number;
/**
 * Converts radians to degrees
 */
export declare function radToDeg(radians: number): number;
/**
 * Parses a color string to RGBA object
 * Supports: hex (#RGB, #RGBA, #RRGGBB, #RRGGBBAA), rgb(), rgba(), named colors
 */
export declare function parseColor(color: ColorInput): RGBAColor;
/**
 * Converts RGBA color to CSS string
 */
export declare function rgbaToString(color: RGBAColor): string;
/**
 * Gets the direction angle in radians for a burst direction
 */
export declare function getDirectionAngle(direction: BurstDirection, customAngle?: number): number;
/**
 * Calculates the center point of an element
 */
export declare function getElementCenter(element: HTMLElement): Point;
/**
 * Deep merges configuration objects
 */
export declare function mergeConfig(options?: ConfettiBurstOptions): ConfettiBurstConfig;
/**
 * Checks if the code is running in a browser environment
 */
export declare function isBrowser(): boolean;
/**
 * Gets the device pixel ratio, capped for performance
 */
export declare function getDevicePixelRatio(maxDpr?: number): number;
/**
 * Creates a deferred promise for async control
 */
export declare function createDeferred<T = void>(): {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
};
/**
 * Validates that a value is within a valid range
 */
export declare function validateRange(value: number, min: number, max: number, name: string): void;
/**
 * Calculates distance between two points
 */
export declare function distance(p1: Point, p2: Point): number;
/**
 * Normalizes an angle to be between 0 and 2π
 */
export declare function normalizeAngle(angle: number): number;
