/**
 * Functional Confetti API
 *
 * Provides a canvas-confetti compatible function-based API for
 * imperative confetti control without React components.
 *
 * @module confetti
 */
import type { CanvasConfettiOptions, ConfettiCreateOptions } from './types';
/**
 * Main confetti function - canvas-confetti compatible API
 *
 * @example
 * ```typescript
 * // Basic confetti burst
 * confetti();
 *
 * // Customized confetti
 * confetti({
 *   particleCount: 100,
 *   spread: 70,
 *   origin: { x: 0.5, y: 0.5 }
 * });
 *
 * // Wait for completion
 * await confetti({ particleCount: 200 });
 * console.log('Confetti finished!');
 * ```
 *
 * @param options - Confetti configuration options
 * @returns Promise that resolves when animation completes
 */
export declare function confetti(options?: CanvasConfettiOptions): Promise<void> | null;
export declare namespace confetti {
    var create: (canvas: HTMLCanvasElement, globalOptions?: ConfettiCreateOptions) => ((options?: CanvasConfettiOptions) => Promise<void> | null) & {
        reset: () => void;
    };
    var reset: () => void;
    var fireworks: (options?: Partial<CanvasConfettiOptions>) => Promise<void>;
    var schoolPride: (options?: Partial<CanvasConfettiOptions>) => void;
    var snow: (options?: {
        duration?: number;
    } & Partial<CanvasConfettiOptions>) => void;
    var burst: (origin: {
        x: number;
        y: number;
    }, options?: Partial<CanvasConfettiOptions>) => Promise<void> | null;
}
export default confetti;
//# sourceMappingURL=confetti.d.ts.map