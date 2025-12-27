/**
 * Default constants and configuration values
 * 
 * All default values are carefully tuned for optimal visual appeal
 * and performance across different devices and screen sizes.
 */

import type {
  ConfettiBurstConfig,
  ParticleConfig,
  PhysicsConfig,
  DirectionConfig,
  EasingFunction,
  EasingPreset,
  RGBAColor,
  ContinuousConfig,
  FireworkConfig,
  CanvasConfig,
  TrailConfig,
  GlowConfig,
  PresetConfig,
  PresetName,
  ConfettiBurstOptions,
} from './types';

/**
 * Default vibrant color palette for confetti particles
 * Designed for high visibility on both light and dark backgrounds
 */
export const DEFAULT_COLORS: readonly string[] = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#F38181', // Salmon
  '#AA96DA', // Lavender
  '#FCBAD3', // Pink
  '#A8D8EA', // Sky Blue
  '#FF9A8B', // Peach
  '#88D8B0', // Sea Green
] as const;

/**
 * Default physics configuration
 */
export const DEFAULT_PHYSICS: PhysicsConfig = {
  gravity: 0.3,
  drag: 0.02,
  friction: 0.99,
  rotationSpeed: 1,
  wind: 0,
  windVariation: 0,
  tumble: true,
  decay: 0.98,
  bounce: 0,
  floor: null,
  wobble: false,
  wobbleSpeed: 1,
} as const;

/**
 * Default direction configuration
 */
export const DEFAULT_DIRECTION: DirectionConfig = {
  direction: 'up',
  spread: 45,
  velocity: [20, 40] as const,
} as const;

/**
 * Default particle configuration
 */
export const DEFAULT_PARTICLE: ParticleConfig = {
  colors: DEFAULT_COLORS,
  shapes: ['square', 'circle'] as const,
  size: [8, 12] as const,
  opacity: [0.8, 1] as const,
  lifespan: 3000,
  fadeOut: true,
  scaleDown: true,
  spin: true,
  spinSpeed: [-10, 10] as const,
  tilt: [-15, 15] as const,
  depth3D: 0,
} as const;

/**
 * Default trail configuration
 */
export const DEFAULT_TRAIL: TrailConfig = {
  enabled: false,
  length: 10,
  fade: 0.5,
  width: 0.5,
} as const;

/**
 * Default glow configuration
 */
export const DEFAULT_GLOW: GlowConfig = {
  enabled: false,
  blur: 10,
  color: null,
  intensity: 0.5,
} as const;

/**
 * Default continuous mode configuration
 */
export const DEFAULT_CONTINUOUS: ContinuousConfig = {
  recycle: false,
  numberOfPieces: 200,
  spawnRate: 50,
  run: true,
  tweenDuration: 5000,
} as const;

/**
 * Default firework configuration
 */
export const DEFAULT_FIREWORK: FireworkConfig = {
  secondaryExplosions: true,
  burstCount: 80,
  burstDelay: 500,
  spread: 360,
  launchHeight: 0.6,
  rocketColors: ['#ffd700', '#ff6b35', '#ff0000'],
  burstColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  trailLength: 10,
  riseDuration: 1000,
  showRocket: true,
} as const;

/**
 * Default canvas configuration
 */
export const DEFAULT_CANVAS: CanvasConfig = {
  width: null,
  height: null,
  autoResize: true,
  resizeDebounce: 100,
  frameRate: null,
  pixelRatio: null,
  useWorker: false,
  useOffscreen: false,
} as const;

/**
 * Default accessibility configuration
 */
export const DEFAULT_ACCESSIBILITY = {
  disableForReducedMotion: false,
  ariaLabel: 'Confetti animation',
  ariaHidden: true,
} as const;

/**
 * Complete default configuration
 */
export const DEFAULT_CONFIG: ConfettiBurstConfig = {
  particleCount: 50,
  particle: DEFAULT_PARTICLE,
  physics: DEFAULT_PHYSICS,
  direction: DEFAULT_DIRECTION,
  mode: 'burst',
  easing: 'easeOut',
  zIndex: 9999,
  autoCleanup: true,
  scalar: 1,
  drift: 0,
  flat: false,
} as const;

/**
 * Direction angles in degrees (0 = right, counter-clockwise)
 */
export const DIRECTION_ANGLES: Record<Exclude<import('./types').BurstDirection, 'custom' | 'radial'>, number> = {
  up: 90,
  down: 270,
  left: 180,
  right: 0,
} as const;

/**
 * Pre-calculated values for performance
 */
export const MATH_CONSTANTS = {
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
} as const;

/**
 * Easing functions for smooth animations
 */
export const EASING_FUNCTIONS: Record<EasingPreset, EasingFunction> = {
  linear: (t: number): number => t,
  
  easeIn: (t: number): number => t * t * t,
  
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),
  
  easeInOut: (t: number): number => 
    t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  bounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  
  elastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    
    if (t === 0) return 0;
    if (t === 1) return 1;
    
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  back: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  circ: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),

  expo: (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
} as const;

/**
 * Built-in shape names (excluding custom shapes)
 */
type BuiltinShapeName = 
  | 'square' 
  | 'circle' 
  | 'rectangle' 
  | 'triangle' 
  | 'star' 
  | 'line' 
  | 'heart' 
  | 'diamond' 
  | 'hexagon' 
  | 'spiral' 
  | 'ribbon' 
  | 'custom';

/**
 * Shape rendering aspect ratios
 */
export const SHAPE_ASPECT_RATIOS: Record<BuiltinShapeName, number> = {
  square: 1,
  circle: 1,
  rectangle: 2,
  triangle: 1,
  star: 1,
  line: 4,
  heart: 1,
  diamond: 1,
  hexagon: 1,
  spiral: 1,
  ribbon: 3,
  custom: 1,
} as const;

/**
 * Default transparent color for fallback
 */
export const TRANSPARENT_COLOR: RGBAColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 0,
} as const;

/**
 * Performance tuning constants
 */
export const PERFORMANCE = {
  /** Maximum particles before reducing quality */
  MAX_PARTICLES: 500,
  /** Frame time budget in ms (targeting 60fps) */
  FRAME_BUDGET: 16.67,
  /** Minimum opacity before particle is considered dead */
  MIN_OPACITY: 0.01,
  /** Minimum size before particle is considered dead */
  MIN_SIZE: 0.5,
  /** Device pixel ratio limit for high-DPI displays */
  MAX_DPR: 2,
} as const;

/**
 * Canvas cleanup delay in milliseconds
 */
export const CLEANUP_DELAY = 100;

/**
 * Star shape points configuration
 */
export const STAR_POINTS = 5;
export const STAR_INNER_RATIO = 0.5;

/**
 * Color palettes for presets
 */
export const COLOR_PALETTES = {
  rainbow: DEFAULT_COLORS,
  pride: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'] as const,
  christmas: ['#C41E3A', '#165B33', '#FFD700', '#FFFFFF', '#BB2528'] as const,
  halloween: ['#FF6600', '#000000', '#8B008B', '#00FF00', '#FFD700'] as const,
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] as const,
  neon: ['#FF00FF', '#00FFFF', '#FF0080', '#80FF00', '#FF8000'] as const,
  gold: ['#FFD700', '#DAA520', '#B8860B', '#FFC125', '#FFDF00'] as const,
  silver: ['#C0C0C0', '#A8A8A8', '#D3D3D3', '#DCDCDC', '#E8E8E8'] as const,
  hearts: ['#FF69B4', '#FF1493', '#FF007F', '#DC143C', '#FFB6C1'] as const,
  ocean: ['#006994', '#00CED1', '#20B2AA', '#48D1CC', '#87CEEB'] as const,
} as const;

/**
 * Emoji sets for presets
 */
export const EMOJI_SETS = {
  celebration: ['🎉', '🎊', '🥳', '✨', '🎈'] as const,
  hearts: ['❤️', '💕', '💖', '💗', '💓', '💘'] as const,
  stars: ['⭐', '🌟', '✨', '💫', '⚡'] as const,
  money: ['💰', '💵', '💸', '🤑', '💎'] as const,
  christmas: ['🎄', '🎅', '🎁', '❄️', '⭐'] as const,
  halloween: ['🎃', '👻', '🦇', '🕷️', '💀'] as const,
  birthday: ['🎂', '🎁', '🎈', '🎉', '🥳'] as const,
  food: ['🍕', '🍔', '🍟', '🌭', '🍿'] as const,
} as const;

/**
 * Preset configurations for quick setup
 */
export const PRESETS: Record<PresetName, PresetConfig> = {
  default: {
    name: 'default',
    description: 'Default balanced confetti burst',
    options: {},
  },
  celebration: {
    name: 'celebration',
    description: 'Big celebration with lots of colorful confetti',
    options: {
      particleCount: 100,
      particle: {
        colors: [...COLOR_PALETTES.rainbow],
        shapes: ['square', 'circle', 'star'] as const,
        size: [10, 15] as const,
        lifespan: 4000,
      },
      direction: {
        direction: 'radial',
        spread: 360,
        velocity: [25, 50] as const,
      },
    },
  },
  firework: {
    name: 'firework',
    description: 'Firework-style explosion with secondary bursts',
    options: {
      mode: 'firework',
      particleCount: 80,
      particle: {
        colors: [...COLOR_PALETTES.neon],
        shapes: ['circle', 'star'] as const,
        size: [4, 8] as const,
        trail: { enabled: true, length: 8, fade: 0.6 },
        glow: { enabled: true, blur: 8, intensity: 0.7 },
      },
      firework: {
        secondaryExplosions: true,
        burstCount: 80,
      },
    },
  },
  snow: {
    name: 'snow',
    description: 'Gentle falling snowflakes',
    options: {
      mode: 'snow',
      particleCount: 150,
      particle: {
        colors: ['#FFFFFF', '#F0F8FF', '#E0FFFF'] as const,
        shapes: ['circle'] as const,
        size: [3, 8] as const,
        lifespan: 8000,
        opacity: [0.6, 1] as const,
      },
      physics: {
        gravity: 0.05,
        wind: 0.3,
        windVariation: 0.2,
        wobble: true,
        wobbleSpeed: 2,
      },
      continuous: {
        recycle: true,
        numberOfPieces: 150,
      },
    },
  },
  rain: {
    name: 'rain',
    description: 'Rainfall effect',
    options: {
      mode: 'rain',
      particleCount: 200,
      particle: {
        colors: ['#6CA0DC', '#4A90D9', '#2E7BB9'] as const,
        shapes: ['line'] as const,
        size: [2, 4] as const,
        lifespan: 2000,
      },
      physics: {
        gravity: 0.8,
        wind: 0.1,
      },
      direction: {
        direction: 'down',
        spread: 10,
        velocity: [30, 50] as const,
      },
      continuous: {
        recycle: true,
      },
    },
  },
  sparkle: {
    name: 'sparkle',
    description: 'Sparkling stars with glow effect',
    options: {
      particleCount: 40,
      particle: {
        colors: [...COLOR_PALETTES.gold],
        shapes: ['star'] as const,
        size: [6, 12] as const,
        glow: { enabled: true, blur: 15, intensity: 0.8 },
      },
      physics: {
        gravity: 0.1,
      },
    },
  },
  confetti: {
    name: 'confetti',
    description: 'Classic confetti falling from top',
    options: {
      mode: 'continuous',
      particleCount: 200,
      particle: {
        shapes: ['square', 'rectangle'] as const,
        size: [8, 14] as const,
      },
      physics: {
        gravity: 0.2,
        wind: 0.1,
        wobble: true,
      },
      continuous: {
        recycle: true,
        numberOfPieces: 200,
      },
      spawnArea: {
        x: 0,
        y: 0,
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: 0,
      },
    },
  },
  emoji: {
    name: 'emoji',
    description: 'Emoji celebration',
    options: {
      particleCount: 30,
      particle: {
        images: EMOJI_SETS.celebration.map(emoji => ({
          src: emoji,
          isEmoji: true,
          scale: 1.5,
        })),
        size: [20, 30] as const,
        lifespan: 4000,
      },
      direction: {
        direction: 'up',
        spread: 60,
        velocity: [20, 35] as const,
      },
    },
  },
  hearts: {
    name: 'hearts',
    description: 'Floating hearts',
    options: {
      particleCount: 50,
      particle: {
        colors: [...COLOR_PALETTES.hearts],
        shapes: ['heart'] as const,
        size: [12, 20] as const,
        lifespan: 5000,
      },
      physics: {
        gravity: -0.1,
        wobble: true,
      },
      direction: {
        direction: 'up',
        spread: 90,
        velocity: [10, 20] as const,
      },
    },
  },
  stars: {
    name: 'stars',
    description: 'Shooting stars',
    options: {
      particleCount: 60,
      particle: {
        colors: [...COLOR_PALETTES.gold, '#FFFFFF'],
        shapes: ['star'] as const,
        size: [8, 16] as const,
        trail: { enabled: true, length: 12, fade: 0.4 },
      },
      direction: {
        direction: 'radial',
        spread: 360,
        velocity: [30, 60] as const,
      },
    },
  },
  money: {
    name: 'money',
    description: 'Money rain',
    options: {
      particleCount: 40,
      particle: {
        colors: ['#85BB65', '#228B22', '#32CD32'] as const,
        images: EMOJI_SETS.money.map(emoji => ({
          src: emoji,
          isEmoji: true,
        })),
        size: [20, 30] as const,
        lifespan: 4000,
      },
      physics: {
        gravity: 0.15,
        wobble: true,
      },
    },
  },
  pride: {
    name: 'pride',
    description: 'Pride rainbow celebration',
    options: {
      particleCount: 100,
      particle: {
        colors: [...COLOR_PALETTES.pride],
        shapes: ['square', 'rectangle', 'heart'] as const,
        size: [10, 16] as const,
      },
      direction: {
        direction: 'radial',
        spread: 360,
        velocity: [25, 45] as const,
      },
    },
  },
  christmas: {
    name: 'christmas',
    description: 'Christmas celebration',
    options: {
      particleCount: 80,
      particle: {
        colors: [...COLOR_PALETTES.christmas],
        shapes: ['star', 'circle'] as const,
        size: [8, 14] as const,
        images: EMOJI_SETS.christmas.map(emoji => ({
          src: emoji,
          isEmoji: true,
        })),
      },
    },
  },
  halloween: {
    name: 'halloween',
    description: 'Spooky Halloween',
    options: {
      particleCount: 60,
      particle: {
        colors: [...COLOR_PALETTES.halloween],
        shapes: ['circle', 'star'] as const,
        images: EMOJI_SETS.halloween.map(emoji => ({
          src: emoji,
          isEmoji: true,
        })),
        size: [15, 25] as const,
      },
      physics: {
        gravity: 0.2,
        wobble: true,
      },
    },
  },
  newYear: {
    name: 'newYear',
    description: 'New Year celebration with fireworks',
    options: {
      mode: 'firework',
      particleCount: 100,
      particle: {
        colors: [...COLOR_PALETTES.gold, ...COLOR_PALETTES.silver],
        shapes: ['star', 'circle'] as const,
        size: [6, 12] as const,
        trail: { enabled: true, length: 10 },
        glow: { enabled: true, blur: 12 },
      },
      firework: {
        secondaryExplosions: true,
        burstCount: 100,
      },
    },
  },
  birthday: {
    name: 'birthday',
    description: 'Birthday party celebration',
    options: {
      particleCount: 80,
      particle: {
        colors: [...COLOR_PALETTES.pastel, ...COLOR_PALETTES.rainbow],
        shapes: ['star', 'circle', 'heart'] as const,
        images: EMOJI_SETS.birthday.map(emoji => ({
          src: emoji,
          isEmoji: true,
        })),
        size: [12, 20] as const,
        lifespan: 5000,
      },
      direction: {
        direction: 'up',
        spread: 80,
        velocity: [25, 45] as const,
      },
    },
  },
} as const;

/**
 * Get preset options by name
 */
export function getPreset(name: PresetName): ConfettiBurstOptions {
  return PRESETS[name].options;
}
