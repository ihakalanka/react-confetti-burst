import { jsx as _jsx } from "react/jsx-runtime";
/**
 * React components for confetti animations
 *
 * Provides declarative components for easy integration of confetti
 * effects into React applications.
 */
import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, } from 'react';
import { useConfetti } from './hooks';
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
export function ConfettiBurst({ active, origin, triggerRef, options, onComplete, }) {
    const { fire, fireFromElement } = useConfetti();
    const hasFired = useRef(false);
    useEffect(() => {
        if (active && !hasFired.current) {
            hasFired.current = true;
            let handle = null;
            if (triggerRef?.current) {
                handle = fireFromElement(triggerRef.current, options);
            }
            else if (origin) {
                handle = fire(origin, options);
            }
            if (handle) {
                handle.promise.then(() => {
                    onComplete?.();
                });
            }
        }
    }, [active, origin, triggerRef, options, fire, fireFromElement, onComplete]);
    // Reset when active becomes false
    useEffect(() => {
        if (!active) {
            hasFired.current = false;
        }
    }, [active]);
    return null;
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
export const ConfettiTrigger = forwardRef(({ options, style }, ref) => {
    const containerRef = useRef(null);
    const { fireFromElement } = useConfetti();
    useImperativeHandle(ref, () => ({
        fire: () => fireFromElement(containerRef.current, options),
    }));
    return (_jsx("div", { ref: containerRef, style: {
            position: 'absolute',
            width: 1,
            height: 1,
            pointerEvents: 'none',
            ...style,
        }, "aria-hidden": "true" }));
});
ConfettiTrigger.displayName = 'ConfettiTrigger';
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
export const ConfettiButton = forwardRef(({ children, confettiOptions, fireOnClick = true, onClick, ...buttonProps }, forwardedRef) => {
    const internalRef = useRef(null);
    const { fireFromElement } = useConfetti();
    // Combine refs
    const setRef = useCallback((node) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
            forwardedRef(node);
        }
        else if (forwardedRef) {
            forwardedRef.current = node;
        }
    }, [forwardedRef]);
    const handleClick = useCallback((event) => {
        if (fireOnClick && internalRef.current) {
            fireFromElement(internalRef.current, confettiOptions);
        }
        onClick?.(event);
    }, [fireOnClick, fireFromElement, confettiOptions, onClick]);
    return (_jsx("button", { ref: setRef, onClick: handleClick, ...buttonProps, children: children }));
});
ConfettiButton.displayName = 'ConfettiButton';
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
export function ConfettiOnMount({ origin, options, onComplete, delay = 0, }) {
    const { fire } = useConfetti();
    const hasFired = useRef(false);
    useEffect(() => {
        if (hasFired.current)
            return;
        hasFired.current = true;
        const burstOrigin = origin ?? {
            x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
            y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        };
        const timeoutId = setTimeout(() => {
            const handle = fire(burstOrigin, options);
            handle.promise.then(() => onComplete?.());
        }, delay);
        return () => clearTimeout(timeoutId);
    }, [fire, origin, options, onComplete, delay]);
    return null;
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
export function ConfettiCannon({ left = 0, top = 0, angle = 90, options, fire: shouldFire = false, onComplete, }) {
    const { fire } = useConfetti();
    const hasFired = useRef(false);
    useEffect(() => {
        if (!shouldFire || hasFired.current)
            return;
        if (typeof window === 'undefined')
            return;
        hasFired.current = true;
        // Calculate position
        const x = typeof left === 'string' && left.endsWith('%')
            ? (parseFloat(left) / 100) * window.innerWidth
            : typeof left === 'number'
                ? left
                : parseFloat(left) || 0;
        const y = typeof top === 'string' && top.endsWith('%')
            ? (parseFloat(top) / 100) * window.innerHeight
            : typeof top === 'number'
                ? top
                : parseFloat(top) || 0;
        const handle = fire({ x, y }, {
            ...options,
            direction: {
                ...options?.direction,
                direction: 'custom',
                angle,
            },
        });
        handle.promise.then(() => onComplete?.());
    }, [shouldFire, left, top, angle, options, fire, onComplete]);
    // Reset when fire becomes false
    useEffect(() => {
        if (!shouldFire) {
            hasFired.current = false;
        }
    }, [shouldFire]);
    return null;
}
export function Confetti({ width, height, numberOfPieces = 200, confettiSource, initialVelocityX, initialVelocityY, recycle = true, run = true, gravity = 0.3, wind = 0, opacity = 1, drawShape, tweenDuration = 100, colors, onConfettiComplete, frameRate,
// style and className are for API compatibility but not used in canvas
 }) {
    const { fire } = useConfetti();
    const handleRef = useRef(null);
    const hasStarted = useRef(false);
    useEffect(() => {
        if (!run) {
            if (handleRef.current) {
                handleRef.current.stop();
                handleRef.current = null;
            }
            hasStarted.current = false;
            return;
        }
        if (hasStarted.current)
            return;
        hasStarted.current = true;
        // Calculate spawn area
        const spawnArea = confettiSource
            ? {
                type: 'rect',
                x: confettiSource.x,
                y: confettiSource.y,
                w: confettiSource.w ?? window.innerWidth,
                h: confettiSource.h ?? 10,
            }
            : {
                type: 'rect',
                x: 0,
                y: 0,
                w: width ?? window.innerWidth,
                h: 10,
            };
        // Convert velocity props
        const velX = typeof initialVelocityX === 'number'
            ? [initialVelocityX * 0.5, initialVelocityX * 1.5]
            : initialVelocityX
                ? [initialVelocityX.min, initialVelocityX.max]
                : [4, 10];
        const velY = typeof initialVelocityY === 'number'
            ? [initialVelocityY * 0.5, initialVelocityY * 1.5]
            : initialVelocityY
                ? [initialVelocityY.min, initialVelocityY.max]
                : [10, 30];
        // Start the continuous confetti
        const centerX = (width ?? window.innerWidth) / 2;
        const centerY = 0;
        handleRef.current = fire({ x: centerX, y: centerY }, {
            particleCount: numberOfPieces,
            particle: {
                colors: colors ?? ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
                opacity: [opacity * 0.8, opacity],
                shapes: ['square', 'circle', 'rectangle'],
                drawShape,
            },
            physics: {
                gravity: gravity * 10, // Scale to match react-confetti
                wind: wind * 5,
                windVariation: velX[1] - velX[0], // Use horizontal velocity as wind variation
            },
            direction: {
                velocity: velY,
            },
            mode: 'continuous',
            spawnArea,
            continuous: {
                recycle,
                numberOfPieces,
                spawnRate: 30,
                run,
                tweenDuration,
            },
            canvas: {
                width,
                height,
                frameRate,
                autoResize: !width && !height,
            },
            onComplete: onConfettiComplete,
        });
        return () => {
            if (handleRef.current) {
                handleRef.current.stop();
                handleRef.current = null;
            }
        };
    }, [
        run,
        width,
        height,
        numberOfPieces,
        confettiSource,
        initialVelocityX,
        initialVelocityY,
        recycle,
        gravity,
        wind,
        opacity,
        drawShape,
        tweenDuration,
        colors,
        onConfettiComplete,
        frameRate,
        fire,
    ]);
    // Handle recycle changes
    useEffect(() => {
        if (handleRef.current && !recycle) {
            // Stop recycling - animation will end naturally
            // This is handled in the engine
        }
    }, [recycle]);
    return null;
}
Confetti.displayName = 'Confetti';
//# sourceMappingURL=components.js.map