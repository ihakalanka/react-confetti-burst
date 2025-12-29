/**
 * React hooks for confetti animations
 *
 * Provides convenient React hooks for triggering confetti bursts
 * with proper lifecycle management and cleanup.
 */
import type { ConfettiBurstOptions, BurstOrigin, ExplosionHandle, UseConfettiReturn } from './types';
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
export declare function useConfetti(): UseConfettiReturn;
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
export declare function useConfettiTrigger<T extends HTMLElement = HTMLElement>(options?: ConfettiBurstOptions): {
    ref: React.RefObject<T>;
    fire: () => ExplosionHandle | null;
    isActive: boolean;
};
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
export declare function useConfettiOnCondition(condition: boolean, origin: BurstOrigin, options?: ConfettiBurstOptions): void;
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
export declare function useConfettiSequence(bursts: Array<{
    origin: BurstOrigin;
    options?: ConfettiBurstOptions;
    delay: number;
}>): {
    start: () => void;
    isActive: boolean;
    cancel: () => void;
};
/**
 * Hook for viewport-centered confetti
 *
 * @param options - Confetti configuration options
 * @returns Fire function for center-screen confetti
 */
export declare function useConfettiCenter(options?: ConfettiBurstOptions): {
    fire: () => ExplosionHandle;
    isActive: boolean;
};
