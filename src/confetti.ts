/**
 * Functional Confetti API
 * 
 * Provides a canvas-confetti compatible function-based API for
 * imperative confetti control without React components.
 * 
 * Built on the new modular engine with:
 * - Strategy Pattern for updaters (wobble, tilt, roll, rotate)
 * - Factory Pattern for particle creation
 * - Object Pool Pattern for performance
 * - Facade Pattern for simplified API
 * 
 * @module confetti
 */

import type {
  CanvasConfettiOptions,
  ConfettiCreateOptions,
} from './types';
import { Container, getEngine, prefersReducedMotion } from './engine';

/**
 * Container registry for managing instances
 */
const containers = new Map<HTMLCanvasElement | 'default', Container>();

/**
 * Get or create a container
 */
function getContainer(
  key: HTMLCanvasElement | 'default',
  options?: ConfettiCreateOptions
): Container {
  let container = containers.get(key);
  
  if (!container || container.destroyed) {
    const containerOptions = key === 'default' 
      ? { resize: true, ...options }
      : { canvas: key, resize: options?.resize ?? false, ...options };
    
    container = new Container(containerOptions);
    containers.set(key, container);
  }
  
  return container;
}

/**
 * Convert CanvasConfettiOptions to engine IConfettiOptions
 */
function convertOptions(options: CanvasConfettiOptions) {
  return {
    particleCount: options.particleCount ?? 100,
    size: options.size ?? 4,
    angle: options.angle ?? 90,
    spread: options.spread ?? 45,
    startVelocity: options.startVelocity ?? 45,
    decay: options.decay ?? 0.94,
    gravity: options.gravity ?? 1,
    drift: options.drift ?? 0,
    flat: options.flat ?? false,
    ticks: options.ticks ?? 200,
    origin: options.origin ?? { x: 0.5, y: 0.5 },
    colors: options.colors as string[] ?? undefined,
    shapes: options.shapes as string[] ?? undefined,
    scalar: options.scalar ?? 1,
  };
}

/**
 * Fire confetti! 🎉
 * 
 * The main confetti function - call it to create a burst of confetti particles.
 * Compatible with canvas-confetti API.
 * 
 * @example
 * ```typescript
 * // Basic usage
 * confetti();
 * 
 * // With options
 * confetti({ 
 *   particleCount: 150,
 *   spread: 70,
 *   origin: { x: 0.5, y: 0.5 }
 * });
 * 
 * // Await completion
 * await confetti({ particleCount: 200 });
 * console.log('Confetti finished!');
 * ```
 * 
 * @param options - Confetti configuration options
 * @returns Promise that resolves when animation completes
 */
export function confetti(options: CanvasConfettiOptions = {}): Promise<void> | null {
  // Check for reduced motion preference
  if (options.disableForReducedMotion && prefersReducedMotion()) {
    return Promise.resolve();
  }
  
  try {
    const container = getContainer('default');
    return container.fire(convertOptions(options));
  } catch (error) {
    console.error('Confetti error:', error);
    return null;
  }
}

/**
 * Create a confetti instance bound to a specific canvas
 * 
 * @example
 * ```typescript
 * // Custom canvas confetti
 * const myCanvas = document.getElementById('my-canvas');
 * const myConfetti = confetti.create(myCanvas, { resize: true });
 * 
 * // Use the custom instance
 * myConfetti({ particleCount: 100 });
 * 
 * // Reset/clear the custom instance
 * myConfetti.reset();
 * ```
 * 
 * @param canvas - Target canvas element
 * @param globalOptions - Global options for this instance
 * @returns Confetti function bound to the canvas
 */
confetti.create = function(
  canvas: HTMLCanvasElement,
  globalOptions: ConfettiCreateOptions = {}
): ((options?: CanvasConfettiOptions) => Promise<void> | null) & { reset: () => void } {
  const container = getContainer(canvas, globalOptions);
  
  const fire = (options: CanvasConfettiOptions = {}): Promise<void> | null => {
    // Check for reduced motion preference
    const disableForReducedMotion = options.disableForReducedMotion ?? globalOptions.disableForReducedMotion;
    if (disableForReducedMotion && prefersReducedMotion()) {
      return Promise.resolve();
    }
    
    try {
      return container.fire(convertOptions(options));
    } catch (error) {
      console.error('Confetti error:', error);
      return null;
    }
  };
  
  fire.reset = () => {
    container.stop();
  };
  
  return fire;
};

/**
 * Reset/clear all confetti on the default canvas
 * 
 * @example
 * ```typescript
 * // Fire some confetti
 * confetti({ particleCount: 100 });
 * 
 * // Clear it immediately
 * confetti.reset();
 * ```
 */
confetti.reset = function(): void {
  const container = containers.get('default');
  if (container && !container.destroyed) {
    container.stop();
  }
};

/**
 * Fire confetti from both sides (common celebration pattern)
 * 
 * @example
 * ```typescript
 * // Celebration from both corners
 * await confetti.fireworks();
 * ```
 */
confetti.fireworks = async function(options: Partial<CanvasConfettiOptions> = {}): Promise<void> {
  const baseOptions: CanvasConfettiOptions = {
    particleCount: 30,
    spread: 55,
    ...options,
  };
  
  await Promise.all([
    confetti({
      ...baseOptions,
      angle: 60,
      origin: { x: 0, y: 0.65 },
    }),
    confetti({
      ...baseOptions,
      angle: 120,
      origin: { x: 1, y: 0.65 },
    }),
  ]);
};

/**
 * Fire confetti in a school pride pattern
 * 
 * @example
 * ```typescript
 * // School colors celebration
 * confetti.schoolPride({ colors: ['#ff0000', '#ffffff'] });
 * ```
 */
confetti.schoolPride = function(options: Partial<CanvasConfettiOptions> = {}): void {
  const end = Date.now() + 3000;
  const colors = options.colors ?? ['#bb0000', '#ffffff'];
  
  function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      ...options,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      ...options,
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  
  frame();
};

/**
 * Fire confetti in a snow pattern
 * 
 * @example
 * ```typescript
 * confetti.snow({ duration: 5000 });
 * ```
 */
confetti.snow = function(options: { duration?: number } & Partial<CanvasConfettiOptions> = {}): void {
  const { duration = 5000, ...confettiOptions } = options;
  const end = Date.now() + duration;
  
  function frame() {
    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: 300,
      gravity: 0.3,
      origin: {
        x: Math.random(),
        y: 0,
      },
      colors: ['#ffffff', '#f0f8ff', '#e6f3ff'],
      shapes: ['circle'],
      scalar: 0.8 + Math.random() * 0.4,
      drift: Math.random() - 0.5,
      ...confettiOptions,
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  
  frame();
};

/**
 * Fire realistic looking firework bursts
 * 
 * @example
 * ```typescript
 * confetti.burst({ x: 0.5, y: 0.3 });
 * ```
 */
confetti.burst = function(
  origin: { x: number; y: number },
  options: Partial<CanvasConfettiOptions> = {}
): Promise<void> | null {
  return confetti({
    particleCount: 80,
    spread: 360,
    startVelocity: 30,
    decay: 0.92,
    scalar: 1.2,
    origin,
    ...options,
  });
};

/**
 * Destroy all containers and cleanup resources
 */
confetti.destroyAll = function(): void {
  for (const container of containers.values()) {
    container.destroy();
  }
  containers.clear();
  getEngine().destroyAll();
};

/**
 * Get available shape types
 */
confetti.getShapes = function(): string[] {
  // Get from default shape registry
  return ['square', 'circle', 'star', 'triangle', 'rectangle', 'diamond', 'heart', 'hexagon'];
};

// Make confetti the default export
export default confetti;
