/**
 * Default constants and configuration values
 *
 * All default values are carefully tuned for optimal visual appeal
 * and performance across different devices and screen sizes.
 */
import type { ConfettiBurstConfig, ParticleConfig, PhysicsConfig, DirectionConfig, EasingFunction, EasingPreset, RGBAColor, ContinuousConfig, FireworkConfig, CanvasConfig, TrailConfig, GlowConfig, PresetConfig, PresetName, ConfettiBurstOptions } from './types';
/**
 * Default vibrant color palette for confetti particles
 * Designed for high visibility on both light and dark backgrounds
 */
export declare const DEFAULT_COLORS: readonly string[];
/**
 * Default physics configuration
 */
export declare const DEFAULT_PHYSICS: PhysicsConfig;
/**
 * Default direction configuration
 */
export declare const DEFAULT_DIRECTION: DirectionConfig;
/**
 * Default particle configuration
 */
export declare const DEFAULT_PARTICLE: ParticleConfig;
/**
 * Default trail configuration
 */
export declare const DEFAULT_TRAIL: TrailConfig;
/**
 * Default glow configuration
 */
export declare const DEFAULT_GLOW: GlowConfig;
/**
 * Default continuous mode configuration
 */
export declare const DEFAULT_CONTINUOUS: ContinuousConfig;
/**
 * Default firework configuration
 */
export declare const DEFAULT_FIREWORK: FireworkConfig;
/**
 * Default canvas configuration
 */
export declare const DEFAULT_CANVAS: CanvasConfig;
/**
 * Default accessibility configuration
 */
export declare const DEFAULT_ACCESSIBILITY: {
    readonly disableForReducedMotion: false;
    readonly ariaLabel: "Confetti animation";
    readonly ariaHidden: true;
};
/**
 * Complete default configuration
 */
export declare const DEFAULT_CONFIG: ConfettiBurstConfig;
/**
 * Direction angles in degrees (0 = right, counter-clockwise)
 */
export declare const DIRECTION_ANGLES: Record<Exclude<import('./types').BurstDirection, 'custom' | 'radial'>, number>;
/**
 * Pre-calculated values for performance
 */
export declare const MATH_CONSTANTS: {
    readonly DEG_TO_RAD: number;
    readonly RAD_TO_DEG: number;
    readonly TWO_PI: number;
    readonly HALF_PI: number;
};
/**
 * Easing functions for smooth animations
 */
export declare const EASING_FUNCTIONS: Record<EasingPreset, EasingFunction>;
/**
 * Built-in shape names (excluding custom shapes)
 */
type BuiltinShapeName = 'square' | 'circle' | 'rectangle' | 'triangle' | 'star' | 'line' | 'heart' | 'diamond' | 'hexagon' | 'spiral' | 'ribbon' | 'custom';
/**
 * Shape rendering aspect ratios
 */
export declare const SHAPE_ASPECT_RATIOS: Record<BuiltinShapeName, number>;
/**
 * Default transparent color for fallback
 */
export declare const TRANSPARENT_COLOR: RGBAColor;
/**
 * Performance tuning constants
 */
export declare const PERFORMANCE: {
    /** Maximum particles before reducing quality */
    readonly MAX_PARTICLES: 500;
    /** Frame time budget in ms (targeting 60fps) */
    readonly FRAME_BUDGET: 16.67;
    /** Minimum opacity before particle is considered dead */
    readonly MIN_OPACITY: 0.01;
    /** Minimum size before particle is considered dead */
    readonly MIN_SIZE: 0.5;
    /** Device pixel ratio limit for high-DPI displays */
    readonly MAX_DPR: 2;
};
/**
 * Canvas cleanup delay in milliseconds
 */
export declare const CLEANUP_DELAY = 100;
/**
 * Star shape points configuration
 */
export declare const STAR_POINTS = 5;
export declare const STAR_INNER_RATIO = 0.5;
/**
 * Color palettes for presets
 */
export declare const COLOR_PALETTES: {
    readonly rainbow: readonly string[];
    readonly pride: readonly ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982"];
    readonly christmas: readonly ["#C41E3A", "#165B33", "#FFD700", "#FFFFFF", "#BB2528"];
    readonly halloween: readonly ["#FF6600", "#000000", "#8B008B", "#00FF00", "#FFD700"];
    readonly pastel: readonly ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"];
    readonly neon: readonly ["#FF00FF", "#00FFFF", "#FF0080", "#80FF00", "#FF8000"];
    readonly gold: readonly ["#FFD700", "#DAA520", "#B8860B", "#FFC125", "#FFDF00"];
    readonly silver: readonly ["#C0C0C0", "#A8A8A8", "#D3D3D3", "#DCDCDC", "#E8E8E8"];
    readonly hearts: readonly ["#FF69B4", "#FF1493", "#FF007F", "#DC143C", "#FFB6C1"];
    readonly ocean: readonly ["#006994", "#00CED1", "#20B2AA", "#48D1CC", "#87CEEB"];
};
/**
 * Emoji sets for presets
 */
export declare const EMOJI_SETS: {
    readonly celebration: readonly ["🎉", "🎊", "🥳", "✨", "🎈"];
    readonly hearts: readonly ["❤️", "💕", "💖", "💗", "💓", "💘"];
    readonly stars: readonly ["⭐", "🌟", "✨", "💫", "⚡"];
    readonly money: readonly ["💰", "💵", "💸", "🤑", "💎"];
    readonly christmas: readonly ["🎄", "🎅", "🎁", "❄️", "⭐"];
    readonly halloween: readonly ["🎃", "👻", "🦇", "🕷️", "💀"];
    readonly birthday: readonly ["🎂", "🎁", "🎈", "🎉", "🥳"];
    readonly food: readonly ["🍕", "🍔", "🍟", "🌭", "🍿"];
};
/**
 * Preset configurations for quick setup
 */
export declare const PRESETS: Record<PresetName, PresetConfig>;
/**
 * Get preset options by name
 */
export declare function getPreset(name: PresetName): ConfettiBurstOptions;
export {};
//# sourceMappingURL=constants.d.ts.map