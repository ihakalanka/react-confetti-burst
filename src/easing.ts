/**
 * Easing functions for smooth animations
 * Separated for tree-shaking optimization
 */

import type { EasingFunction, EasingPreset } from './types';

/**
 * Easing functions for smooth animations
 */
export const EASING_FUNCTIONS: Record<EasingPreset, EasingFunction> = {
  linear: (t: number): number => t,

  easeIn: (t: number): number => t * t * t,

  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),

  easeInOut: (t: number): number =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2,

  bounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  elastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;

    if (t === 0) return 0;
    if (t === 1) return 1;

    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  back: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  circ: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),

  expo: (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
} as const;