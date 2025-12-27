/**
 * React components for confetti animations
 * 
 * Provides declarative components for easy integration of confetti
 * effects into React applications.
 */

import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

import type {
  ConfettiBurstProps,
  ConfettiButtonProps,
  ExplosionHandle,
  BurstOrigin,
} from './types';

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
export function ConfettiBurst({
  active,
  origin,
  triggerRef,
  options,
  onComplete,
}: ConfettiBurstProps): null {
  const { fire, fireFromElement } = useConfetti();
  const hasFired = useRef(false);

  useEffect(() => {
    if (active && !hasFired.current) {
      hasFired.current = true;

      let handle: ExplosionHandle | null = null;

      if (triggerRef?.current) {
        handle = fireFromElement(triggerRef.current, options);
      } else if (origin) {
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
export const ConfettiTrigger = forwardRef<
  ConfettiTriggerHandle,
  {
    options?: ConfettiBurstProps['options'];
    style?: React.CSSProperties;
  }
>(({ options, style }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { fireFromElement } = useConfetti();

  useImperativeHandle(ref, () => ({
    fire: () => fireFromElement(containerRef.current, options),
  }));

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    />
  );
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
export const ConfettiButton = forwardRef<HTMLButtonElement, ConfettiButtonProps>(
  (
    {
      children,
      confettiOptions,
      fireOnClick = true,
      onClick,
      ...buttonProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const { fireFromElement } = useConfetti();

    // Combine refs
    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (fireOnClick && internalRef.current) {
          fireFromElement(internalRef.current, confettiOptions);
        }
        onClick?.(event);
      },
      [fireOnClick, fireFromElement, confettiOptions, onClick]
    );

    return (
      <button ref={setRef} onClick={handleClick} {...buttonProps}>
        {children}
      </button>
    );
  }
);

ConfettiButton.displayName = 'ConfettiButton';

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
export function ConfettiOnMount({
  origin,
  options,
  onComplete,
  delay = 0,
}: ConfettiOnMountProps): null {
  const { fire } = useConfetti();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
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
export function ConfettiCannon({
  left = 0,
  top = 0,
  angle = 90,
  options,
  fire: shouldFire = false,
  onComplete,
}: ConfettiCannonProps): null {
  const { fire } = useConfetti();
  const hasFired = useRef(false);

  useEffect(() => {
    if (!shouldFire || hasFired.current) return;
    
    if (typeof window === 'undefined') return;

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

    const handle = fire(
      { x, y },
      {
        ...options,
        direction: {
          ...options?.direction,
          direction: 'custom',
          angle,
        },
      }
    );

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
  confettiSource?: { x: number; y: number; w?: number; h?: number };
  /** Initial horizontal velocity range (default: [4, 10]) */
  initialVelocityX?: number | { min: number; max: number };
  /** Initial vertical velocity range (default: [10, 30]) */
  initialVelocityY?: number | { min: number; max: number };
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

export function Confetti({
  width,
  height,
  numberOfPieces = 200,
  confettiSource,
  initialVelocityX,
  initialVelocityY,
  recycle = true,
  run = true,
  gravity = 0.3,
  wind = 0,
  opacity = 1,
  drawShape,
  tweenDuration = 100,
  colors,
  onConfettiComplete,
  frameRate,
  // style and className are for API compatibility but not used in canvas
}: ConfettiComponentProps): null {
  const { fire } = useConfetti();
  const handleRef = useRef<ExplosionHandle | null>(null);
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

    if (hasStarted.current) return;
    hasStarted.current = true;

    // Calculate spawn area
    const spawnArea = confettiSource 
      ? {
          type: 'rect' as const,
          x: confettiSource.x,
          y: confettiSource.y,
          w: confettiSource.w ?? window.innerWidth,
          h: confettiSource.h ?? 10,
        }
      : {
          type: 'rect' as const,
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

    handleRef.current = fire(
      { x: centerX, y: centerY },
      {
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
          velocity: velY as [number, number],
        },
        mode: 'continuous' as any,
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
      } as any
    );

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
