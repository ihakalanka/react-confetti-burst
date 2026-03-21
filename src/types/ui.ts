/**
 * React component and hook types
 */

import type { BurstOrigin, EasingFunction } from './core';
import type { SpawnArea } from './physics';
import type { ParticleState } from './particles';
import type { ConfettiBurstOptions, ExplosionHandle } from './config';

/**
 * Hook return type for useConfetti
 */
export interface UseConfettiReturn {
  readonly fire: (origin: BurstOrigin, options?: ConfettiBurstOptions) => ExplosionHandle;
  readonly fireFromElement: (element: HTMLElement | null, options?: ConfettiBurstOptions) => ExplosionHandle | null;
  readonly isActive: boolean;
  readonly stopAll: () => void;
  readonly pauseAll: () => void;
  readonly resumeAll: () => void;
  readonly getActiveHandles: () => ExplosionHandle[];
}

/**
 * Props for the ConfettiBurst component
 */
export interface ConfettiBurstProps {
  readonly active: boolean;
  readonly origin?: BurstOrigin;
  readonly triggerRef?: React.RefObject<HTMLElement>;
  readonly options?: ConfettiBurstOptions;
  readonly onComplete?: () => void;
}

/**
 * Props for the ConfettiButton component
 */
export interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly confettiOptions?: ConfettiBurstOptions;
  readonly fireOnClick?: boolean;
  readonly children: React.ReactNode;
}

/**
 * Props for the Confetti component (react-confetti compatible API)
 */
export interface ConfettiProps {
  readonly width?: number;
  readonly height?: number;
  readonly numberOfPieces?: number;
  readonly confettiSource?: SpawnArea;
  readonly friction?: number;
  readonly wind?: number;
  readonly gravity?: number;
  readonly initialVelocityX?: number | { min: number; max: number };
  readonly initialVelocityY?: number | { min: number; max: number };
  readonly colors?: string[];
  readonly opacity?: number;
  readonly recycle?: boolean;
  readonly run?: boolean;
  readonly frameRate?: number;
  readonly tweenDuration?: number;
  readonly tweenFunction?: EasingFunction;
  readonly drawShape?: (ctx: CanvasRenderingContext2D) => void;
  readonly onConfettiComplete?: () => void;
  readonly canvasRef?: React.RefObject<HTMLCanvasElement>;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

/**
 * Preset configuration names
 */
export type PresetName =
  | 'default'
  | 'celebration'
  | 'firework'
  | 'snow'
  | 'rain'
  | 'sparkle'
  | 'confetti'
  | 'emoji'
  | 'hearts'
  | 'stars'
  | 'money'
  | 'pride'
  | 'christmas'
  | 'halloween'
  | 'newYear'
  | 'birthday';

/**
 * Preset configuration
 */
export interface PresetConfig {
  readonly name: PresetName;
  readonly options: ConfettiBurstOptions;
  readonly description: string;
}
