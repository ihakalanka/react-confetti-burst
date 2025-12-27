/**
 * React components for confetti animations
 *
 * Provides declarative components for easy integration of confetti
 * effects into React applications.
 */
import React from 'react';
import type { ConfettiBurstProps, ConfettiButtonProps, ExplosionHandle, BurstOrigin } from './types';
/**
 * Declarative confetti component that fires when active prop changes
 *
 * @example
 * ```tsx
 * const [celebrate, setCelebrate] = useState(false);
 *
 * return (
 *   <>
 *     <ConfettiBurst
 *       active={celebrate}
 *       origin={{ x: 500, y: 300 }}
 *       onComplete={() => setCelebrate(false)}
 *     />
 *     <button onClick={() => setCelebrate(true)}>
 *       Celebrate!
 *     </button>
 *   </>
 * );
 * ```
 */
export declare function ConfettiBurst({ active, origin, triggerRef, options, onComplete, }: ConfettiBurstProps): null;
/**
 * Handle type for ConfettiTrigger ref
 */
export interface ConfettiTriggerHandle {
    fire: () => ExplosionHandle | null;
}
/**
 * Invisible trigger component that fires confetti from its position
 *
 * @example
 * ```tsx
 * const triggerRef = useRef<ConfettiTriggerHandle>(null);
 *
 * return (
 *   <div style={{ position: 'relative' }}>
 *     <ConfettiTrigger ref={triggerRef} options={{ particleCount: 100 }} />
 *     <button onClick={() => triggerRef.current?.fire()}>
 *       Fire!
 *     </button>
 *   </div>
 * );
 * ```
 */
export declare const ConfettiTrigger: React.ForwardRefExoticComponent<{
    options?: ConfettiBurstProps["options"];
    style?: React.CSSProperties;
} & React.RefAttributes<ConfettiTriggerHandle>>;
/**
 * Button component that automatically fires confetti on click
 *
 * @example
 * ```tsx
 * <ConfettiButton
 *   confettiOptions={{
 *     particleCount: 30,
 *     direction: { direction: 'up' }
 *   }}
 * >
 *   Submit
 * </ConfettiButton>
 * ```
 */
export declare const ConfettiButton: React.ForwardRefExoticComponent<ConfettiButtonProps & React.RefAttributes<HTMLButtonElement>>;
/**
 * Props for ConfettiOnMount component
 */
interface ConfettiOnMountProps {
    origin?: BurstOrigin;
    options?: ConfettiBurstProps['options'];
    onComplete?: () => void;
    delay?: number;
}
/**
 * Component that fires confetti when mounted
 *
 * @example
 * ```tsx
 * // Fire confetti when a success page loads
 * function SuccessPage() {
 *   return (
 *     <div>
 *       <ConfettiOnMount
 *         origin={{ x: window.innerWidth / 2, y: window.innerHeight / 3 }}
 *         options={{ particleCount: 100 }}
 *       />
 *       <h1>Success!</h1>
 *     </div>
 *   );
 * }
 * ```
 */
export declare function ConfettiOnMount({ origin, options, onComplete, delay, }: ConfettiOnMountProps): null;
/**
 * Props for ConfettiCannon component
 */
interface ConfettiCannonProps {
    /** Position from left (percentage or pixels) */
    left?: number | string;
    /** Position from top (percentage or pixels) */
    top?: number | string;
    /** Angle in degrees (0 = right, 90 = up) */
    angle?: number;
    /** Confetti options */
    options?: ConfettiBurstProps['options'];
    /** When true, fires the cannon */
    fire?: boolean;
    /** Callback when animation completes */
    onComplete?: () => void;
}
/**
 * Positioned cannon component for directional confetti bursts
 *
 * @example
 * ```tsx
 * <ConfettiCannon
 *   left="10%"
 *   top="80%"
 *   angle={60}
 *   fire={shouldFire}
 *   options={{ particleCount: 50 }}
 * />
 * ```
 */
export declare function ConfettiCannon({ left, top, angle, options, fire: shouldFire, onComplete, }: ConfettiCannonProps): null;
/**
 * React-confetti compatible Confetti component
 *
 * This component provides a drop-in replacement for react-confetti
 * with continuous confetti that falls from the top of the screen.
 *
 * @example
 * ```tsx
 * // Basic usage - continuous confetti
 * <Confetti />
 *
 * // With options
 * <Confetti
 *   width={window.innerWidth}
 *   height={window.innerHeight}
 *   numberOfPieces={200}
 *   recycle={true}
 *   run={true}
 * />
 *
 * // With custom draw function
 * <Confetti
 *   drawShape={ctx => {
 *     ctx.beginPath();
 *     ctx.arc(0, 0, 5, 0, Math.PI * 2);
 *     ctx.fill();
 *   }}
 * />
 * ```
 */
export interface ConfettiComponentProps {
    /** Width of the canvas in pixels (default: window.innerWidth) */
    width?: number;
    /** Height of the canvas in pixels (default: window.innerHeight) */
    height?: number;
    /** Number of confetti pieces (default: 200) */
    numberOfPieces?: number;
    /** Spawn area for confetti pieces */
    confettiSource?: {
        x: number;
        y: number;
        w?: number;
        h?: number;
    };
    /** Initial horizontal velocity range (default: [4, 10]) */
    initialVelocityX?: number | {
        min: number;
        max: number;
    };
    /** Initial vertical velocity range (default: [10, 30]) */
    initialVelocityY?: number | {
        min: number;
        max: number;
    };
    /** Whether to recycle confetti (default: true) */
    recycle?: boolean;
    /** Whether the animation is running (default: true) */
    run?: boolean;
    /** Gravity value (default: 0.3) */
    gravity?: number;
    /** Wind value (default: 0) */
    wind?: number;
    /** Opacity of confetti pieces (0-1, default: 1) */
    opacity?: number;
    /** Custom draw function */
    drawShape?: (ctx: CanvasRenderingContext2D) => void;
    /** Tween duration when recycle changes (ms) */
    tweenDuration?: number;
    /** Array of colors */
    colors?: string[];
    /** Callback when confetti is created */
    onConfettiComplete?: (confetti: any) => void;
    /** Frame rate limit */
    frameRate?: number;
    /** Z-index of the canvas */
    style?: React.CSSProperties;
    /** Class name for the canvas */
    className?: string;
}
export declare function Confetti({ width, height, numberOfPieces, confettiSource, initialVelocityX, initialVelocityY, recycle, run, gravity, wind, opacity, drawShape, tweenDuration, colors, onConfettiComplete, frameRate, }: ConfettiComponentProps): null;
export declare namespace Confetti {
    var displayName: string;
}
export {};
//# sourceMappingURL=components.d.ts.map