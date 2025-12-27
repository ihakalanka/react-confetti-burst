/**
 * React hooks for confetti animations
 * 
 * Provides convenient React hooks for triggering confetti bursts
 * with proper lifecycle management and cleanup.
 */

import { useCallback, useRef, useState, useEffect } from 'react';

import type {
  ConfettiBurstOptions,
  BurstOrigin,
  ExplosionHandle,
  UseConfettiReturn,
} from './types';

import {
  createConfettiExplosion,
  fireFromElement,
} from './confetti-engine';

/**
 * Main hook for triggering confetti animations
 * 
 * @returns Object with fire functions and state
 * 
 * @example
 * ```tsx
 * const { fire, isActive } = useConfetti();
 * 
 * const handleClick = (e) => {
 *   fire({ x: e.clientX, y: e.clientY });
 * };
 * ```
 */
export function useConfetti(): UseConfettiReturn {
  const [isActive, setIsActive] = useState(false);
  const activeHandles = useRef<Set<ExplosionHandle>>(new Set());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeHandles.current.forEach(handle => handle.stop());
      activeHandles.current.clear();
    };
  }, []);

  /**
   * Fires confetti from a point
   */
  const fire = useCallback((
    origin: BurstOrigin,
    options?: ConfettiBurstOptions
  ): ExplosionHandle => {
    const handle = createConfettiExplosion(origin, options);
    
    activeHandles.current.add(handle);
    setIsActive(true);

    handle.promise.then(() => {
      activeHandles.current.delete(handle);
      if (activeHandles.current.size === 0) {
        setIsActive(false);
      }
    });

    return handle;
  }, []);

  /**
   * Fires confetti from an element's center
   */
  const fireFromElementCallback = useCallback((
    element: HTMLElement | null,
    options?: ConfettiBurstOptions
  ): ExplosionHandle | null => {
    if (!element) return null;

    const handle = fireFromElement(element, options);
    
    if (handle) {
      activeHandles.current.add(handle);
      setIsActive(true);

      handle.promise.then(() => {
        activeHandles.current.delete(handle);
        if (activeHandles.current.size === 0) {
          setIsActive(false);
        }
      });
    }

    return handle;
  }, []);

  /**
   * Stops all active animations
   */
  const stopAll = useCallback(() => {
    activeHandles.current.forEach(handle => handle.stop());
    activeHandles.current.clear();
    setIsActive(false);
  }, []);

  /**
   * Pauses all active animations
   */
  const pauseAll = useCallback(() => {
    activeHandles.current.forEach(handle => handle.pause());
  }, []);

  /**
   * Resumes all paused animations
   */
  const resumeAll = useCallback(() => {
    activeHandles.current.forEach(handle => handle.resume());
  }, []);

  /**
   * Gets the currently active handles
   */
  const getActiveHandles = useCallback(() => {
    return Array.from(activeHandles.current);
  }, []);

  return {
    fire,
    fireFromElement: fireFromElementCallback,
    isActive,
    stopAll,
    pauseAll,
    resumeAll,
    getActiveHandles,
  };
}

/**
 * Hook for confetti triggered by a ref element
 * 
 * @param options - Confetti configuration options
 * @returns Ref to attach to trigger element and fire function
 * 
 * @example
 * ```tsx
 * const { ref, fire } = useConfettiTrigger();
 * 
 * return (
 *   <button ref={ref} onClick={fire}>
 *     Celebrate!
 *   </button>
 * );
 * ```
 */
export function useConfettiTrigger<T extends HTMLElement = HTMLElement>(
  options?: ConfettiBurstOptions
): {
  ref: React.RefObject<T>;
  fire: () => ExplosionHandle | null;
  isActive: boolean;
} {
  const ref = useRef<T>(null);
  const { fireFromElement: fireFromEl, isActive } = useConfetti();

  const fire = useCallback(() => {
    return fireFromEl(ref.current, options);
  }, [fireFromEl, options]);

  return { ref, fire, isActive };
}

/**
 * Hook for auto-firing confetti when a condition becomes true
 * 
 * @param condition - When true, fires confetti
 * @param origin - Origin point for the burst
 * @param options - Confetti configuration options
 * 
 * @example
 * ```tsx
 * const [isComplete, setIsComplete] = useState(false);
 * 
 * useConfettiOnCondition(isComplete, { x: 500, y: 300 });
 * ```
 */
export function useConfettiOnCondition(
  condition: boolean,
  origin: BurstOrigin,
  options?: ConfettiBurstOptions
): void {
  const hasFired = useRef(false);
  const { fire } = useConfetti();

  useEffect(() => {
    if (condition && !hasFired.current) {
      hasFired.current = true;
      fire(origin, options);
    }
  }, [condition, fire, origin, options]);

  // Reset when condition becomes false
  useEffect(() => {
    if (!condition) {
      hasFired.current = false;
    }
  }, [condition]);
}

/**
 * Hook for sequencing multiple confetti bursts
 * 
 * @param bursts - Array of burst configurations with delays
 * @returns Start function and active state
 * 
 * @example
 * ```tsx
 * const { start, isActive } = useConfettiSequence([
 *   { origin: { x: 100, y: 100 }, delay: 0 },
 *   { origin: { x: 300, y: 100 }, delay: 200 },
 *   { origin: { x: 500, y: 100 }, delay: 400 },
 * ]);
 * ```
 */
export function useConfettiSequence(
  bursts: Array<{
    origin: BurstOrigin;
    options?: ConfettiBurstOptions;
    delay: number;
  }>
): {
  start: () => void;
  isActive: boolean;
  cancel: () => void;
} {
  const { fire, isActive, stopAll } = useConfetti();
  const timeouts = useRef<number[]>([]);

  const cancel = useCallback(() => {
    timeouts.current.forEach(id => clearTimeout(id));
    timeouts.current = [];
    stopAll();
  }, [stopAll]);

  const start = useCallback(() => {
    cancel(); // Clear any existing sequence

    bursts.forEach(({ origin, options, delay }) => {
      const timeoutId = window.setTimeout(() => {
        fire(origin, options);
      }, delay);
      timeouts.current.push(timeoutId);
    });
  }, [bursts, fire, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeouts.current.forEach(id => clearTimeout(id));
    };
  }, []);

  return { start, isActive, cancel };
}

/**
 * Hook for viewport-centered confetti
 * 
 * @param options - Confetti configuration options
 * @returns Fire function for center-screen confetti
 */
export function useConfettiCenter(options?: ConfettiBurstOptions): {
  fire: () => ExplosionHandle;
  isActive: boolean;
} {
  const { fire: baseFire, isActive } = useConfetti();

  const fire = useCallback(() => {
    const centerOrigin: BurstOrigin = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    return baseFire(centerOrigin, {
      ...options,
      direction: { direction: 'radial' },
    });
  }, [baseFire, options]);

  return { fire, isActive };
}
