/**
 * Utility Functions for the Confetti Engine
 * 
 * Pure functions with no side effects for better testability
 * Following Single Responsibility Principle (SRP)
 * 
 * @module engine/utils
 */

import type { IDelta, IRangeValue } from './interfaces';

// Constants
const DOUBLE_PI = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;
const BASE_FRAME_TIME = 1000 / 60; // 60fps baseline

/**
 * Generate a random number between min and max (inclusive)
 * Uses crypto for better randomness when available
 */
export function getRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0]! / (0xffffffff + 1);
  }
  return Math.random();
}

/**
 * Get random value from a range
 */
export function getRangeValue(range: IRangeValue | number): number {
  if (typeof range === 'number') {
    return range;
  }
  return range.min + getRandom() * (range.max - range.min);
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * DEG_TO_RAD;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians / DEG_TO_RAD;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Normalize angle to 0-2π range
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % DOUBLE_PI;
  if (normalized < 0) {
    normalized += DOUBLE_PI;
  }
  return normalized;
}

/**
 * Calculate delta time information
 */
export function calculateDelta(timestamp: number, lastTimestamp: number): IDelta {
  const value = Math.max(0, timestamp - lastTimestamp);
  const factor = value / BASE_FRAME_TIME;
  return Object.freeze({ value, factor });
}

/**
 * Parse color string to RGB object
 * Supports hex (#RGB, #RRGGBB, #RRGGBBAA) and rgb/rgba formats
 */
export function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
  // Input validation - prevent XSS via color strings
  if (typeof color !== 'string' || color.length > 50) {
    return null;
  }
  
  // Sanitize input - only allow valid color characters
  const sanitized = color.trim().toLowerCase();
  
  // Hex format
  if (sanitized.startsWith('#')) {
    const hex = sanitized.slice(1);
    
    if (!/^[0-9a-f]+$/.test(hex)) {
      return null;
    }
    
    let r: number, g: number, b: number, a = 255;
    
    if (hex.length === 3) {
      r = parseInt(hex[0]! + hex[0], 16);
      g = parseInt(hex[1]! + hex[1], 16);
      b = parseInt(hex[2]! + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = parseInt(hex.slice(6, 8), 16);
    } else {
      return null;
    }
    
    return { r, g, b, a: a / 255 };
  }
  
  // RGB/RGBA format
  const rgbMatch = sanitized.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    return {
      r: clamp(parseInt(rgbMatch[1]!, 10), 0, 255),
      g: clamp(parseInt(rgbMatch[2]!, 10), 0, 255),
      b: clamp(parseInt(rgbMatch[3]!, 10), 0, 255),
      a: rgbMatch[4] !== undefined ? clamp(parseFloat(rgbMatch[4]), 0, 1) : 1,
    };
  }
  
  return null;
}

/**
 * Adjust color brightness
 * @param color - Hex color string
 * @param amount - Positive to lighten, negative to darken
 */
export function adjustColorBrightness(color: string, amount: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  
  const { r, g, b, a } = parsed;
  const newR = clamp(r + amount, 0, 255);
  const newG = clamp(g + amount, 0, 255);
  const newB = clamp(b + amount, 0, 255);
  
  if (a < 1) {
    return `rgba(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)}, ${a})`;
  }
  return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  } catch {
    return false;
  }
}

/**
 * Generate unique ID
 */
let idCounter = 0;
export function generateId(): number {
  return ++idCounter;
}

/**
 * Reset ID counter (for testing)
 */
export function resetIdCounter(): void {
  idCounter = 0;
}

/**
 * Pick random item from array
 */
export function pickRandom<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined;
  const index = Math.floor(getRandom() * array.length);
  return array[index];
}

/**
 * Create frozen object (immutable)
 */
export function freeze<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

/**
 * Deep clone an object (for options)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

/**
 * Validate and sanitize confetti options
 */
export function sanitizeOptions<T extends Record<string, unknown>>(
  options: T,
  defaults: T
): T {
  const result = { ...defaults };
  
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      const value = options[key];
      const defaultValue = defaults[key];
      
      // Type check based on default value type
      if (typeof defaultValue === 'number' && typeof value === 'number') {
        // Validate numbers are finite
        if (Number.isFinite(value)) {
          (result as Record<string, unknown>)[key] = value;
        }
      } else if (typeof defaultValue === 'boolean' && typeof value === 'boolean') {
        (result as Record<string, unknown>)[key] = value;
      } else if (typeof defaultValue === 'string' && typeof value === 'string') {
        // Limit string length for security
        (result as Record<string, unknown>)[key] = value.slice(0, 100);
      } else if (Array.isArray(defaultValue) && Array.isArray(value)) {
        // Limit array length
        (result as Record<string, unknown>)[key] = value.slice(0, 100);
      } else if (typeof defaultValue === 'object' && defaultValue !== null && 
                 typeof value === 'object' && value !== null) {
        (result as Record<string, unknown>)[key] = sanitizeOptions(
          value as Record<string, unknown>,
          defaultValue as Record<string, unknown>
        );
      }
    }
  }
  
  return result;
}

/**
 * Request animation frame with fallback
 */
export function requestFrame(callback: FrameRequestCallback): number {
  if (typeof requestAnimationFrame !== 'undefined') {
    return requestAnimationFrame(callback);
  }
  return setTimeout(callback, BASE_FRAME_TIME) as unknown as number;
}

/**
 * Cancel animation frame with fallback
 */
export function cancelFrame(id: number): void {
  if (typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Get device pixel ratio (capped for performance)
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}
