"use strict";
/**
 * React hooks for confetti animations
 *
 * Provides convenient React hooks for triggering confetti bursts
 * with proper lifecycle management and cleanup.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfetti = useConfetti;
exports.useConfettiTrigger = useConfettiTrigger;
exports.useConfettiOnCondition = useConfettiOnCondition;
exports.useConfettiSequence = useConfettiSequence;
exports.useConfettiCenter = useConfettiCenter;
const react_1 = require("react");
const confetti_engine_1 = require("./confetti-engine");
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
function useConfetti() {
    const [isActive, setIsActive] = (0, react_1.useState)(false);
    const activeHandles = (0, react_1.useRef)(new Set());
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            activeHandles.current.forEach(handle => handle.stop());
            activeHandles.current.clear();
        };
    }, []);
    /**
     * Fires confetti from a point
     */
    const fire = (0, react_1.useCallback)((origin, options) => {
        const handle = (0, confetti_engine_1.createConfettiExplosion)(origin, options);
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
    const fireFromElementCallback = (0, react_1.useCallback)((element, options) => {
        if (!element)
            return null;
        const handle = (0, confetti_engine_1.fireFromElement)(element, options);
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
    const stopAll = (0, react_1.useCallback)(() => {
        activeHandles.current.forEach(handle => handle.stop());
        activeHandles.current.clear();
        setIsActive(false);
    }, []);
    /**
     * Pauses all active animations
     */
    const pauseAll = (0, react_1.useCallback)(() => {
        activeHandles.current.forEach(handle => handle.pause());
    }, []);
    /**
     * Resumes all paused animations
     */
    const resumeAll = (0, react_1.useCallback)(() => {
        activeHandles.current.forEach(handle => handle.resume());
    }, []);
    /**
     * Gets the currently active handles
     */
    const getActiveHandles = (0, react_1.useCallback)(() => {
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
function useConfettiTrigger(options) {
    const ref = (0, react_1.useRef)(null);
    const { fireFromElement: fireFromEl, isActive } = useConfetti();
    const fire = (0, react_1.useCallback)(() => {
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
function useConfettiOnCondition(condition, origin, options) {
    const hasFired = (0, react_1.useRef)(false);
    const { fire } = useConfetti();
    (0, react_1.useEffect)(() => {
        if (condition && !hasFired.current) {
            hasFired.current = true;
            fire(origin, options);
        }
    }, [condition, fire, origin, options]);
    // Reset when condition becomes false
    (0, react_1.useEffect)(() => {
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
function useConfettiSequence(bursts) {
    const { fire, isActive, stopAll } = useConfetti();
    const timeouts = (0, react_1.useRef)([]);
    const cancel = (0, react_1.useCallback)(() => {
        timeouts.current.forEach(id => clearTimeout(id));
        timeouts.current = [];
        stopAll();
    }, [stopAll]);
    const start = (0, react_1.useCallback)(() => {
        cancel(); // Clear any existing sequence
        bursts.forEach(({ origin, options, delay }) => {
            const timeoutId = window.setTimeout(() => {
                fire(origin, options);
            }, delay);
            timeouts.current.push(timeoutId);
        });
    }, [bursts, fire, cancel]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
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
function useConfettiCenter(options) {
    const { fire: baseFire, isActive } = useConfetti();
    const fire = (0, react_1.useCallback)(() => {
        const centerOrigin = {
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
