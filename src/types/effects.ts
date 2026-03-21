/**
 * Effect configuration types (trails, glow, continuous, firework)
 */

/**
 * Trail effect configuration
 */
export interface TrailConfig {
  readonly enabled: boolean;
  readonly length: number;
  readonly fade: number;
  readonly width: number;
}

/**
 * Glow effect configuration
 */
export interface GlowConfig {
  readonly enabled: boolean;
  readonly blur: number;
  readonly color: string | null;
  readonly intensity: number;
}

/**
 * Continuous mode configuration
 */
export interface ContinuousConfig {
  readonly recycle: boolean;
  readonly numberOfPieces: number;
  readonly spawnRate: number;
  readonly run: boolean;
  readonly tweenDuration: number;
}

/**
 * Firework mode configuration
 */
export interface FireworkConfig {
  readonly secondaryExplosions: boolean;
  readonly burstCount: number;
  readonly burstDelay: number;
  readonly spread: number;
  readonly launchHeight: number;
  readonly rocketColors: readonly string[];
  readonly burstColors: readonly string[];
  readonly trailLength: number;
  readonly riseDuration: number;
  readonly showRocket: boolean;
}

/**
 * Canvas configuration
 */
export interface CanvasConfig {
  readonly width: number | null;
  readonly height: number | null;
  readonly autoResize: boolean;
  readonly resizeDebounce: number;
  readonly frameRate: number | null;
  readonly pixelRatio: number | null;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly useWorker: boolean;
  readonly useOffscreen: boolean;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  readonly disableForReducedMotion: boolean;
  readonly ariaLabel?: string;
  readonly ariaHidden: boolean;
}
