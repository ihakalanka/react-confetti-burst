/**
 * Preset configurations for quick setup
 * These are separated from main constants to enable tree-shaking
 * and reduce bundle size for users who don't use presets.
 */

import type { PresetConfig, PresetName } from './types';
import { DEFAULT_COLORS } from './constants';

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
    description: 'Default balanced confetti burst with realistic paper physics',
    options: {
      particleCount: 60,
      particle: {
        shapes: ['square', 'rectangle', 'circle'] as const,
        size: [6, 14] as const,
        depth3D: 0.6,
        tilt: [-30, 30] as const,
      },
      physics: {
        gravity: 0.25,
        drag: 0.035,
        wobble: true,
        wobbleSpeed: 1.5,
      },
    },
  },
  celebration: {
    name: 'celebration',
    description: 'Big celebration with lots of colorful confetti and realistic movement',
    options: {
      particleCount: 120,
      particle: {
        colors: [...DEFAULT_COLORS],
        shapes: ['square', 'rectangle', 'circle', 'star'] as const,
        size: [8, 16] as const,
        lifespan: 5000,
        depth3D: 0.7,
        tilt: [-35, 35] as const,
      },
      direction: {
        direction: 'radial',
        spread: 360,
        velocity: [30, 55],
      },
      physics: {
        gravity: 0.22,
        drag: 0.04,
        wobble: true,
        wobbleSpeed: 2,
        windVariation: 0.03,
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
        colors: ['#FFFFFF', '#F0F8FF', '#E0FFFF'],
        shapes: ['circle'] as const,
        size: [3, 8] as const,
        lifespan: 8000,
        opacity: [0.6, 1],
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
        colors: ['#6CA0DC', '#4A90D9', '#2E7BB9'],
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
        velocity: [30, 50],
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
        colors: ['#FFD700', '#DAA520', '#B8860B', '#FFC125', '#FFDF00'],
        shapes: ['star'] as const,
        size: [6, 12] as const,
        glow: { enabled: true, blur: 15, intensity: 0.8 },
      },
      physics: {
        gravity: 0.1,
      },
      direction: {
        direction: 'radial',
        spread: 360,
        velocity: [30, 60],
      },
    },
  },
  confetti: {
    name: 'confetti',
    description: 'Classic confetti falling with realistic paper flutter',
    options: {
      mode: 'continuous',
      particleCount: 200,
      particle: {
        shapes: ['square', 'rectangle'] as const,
        size: [6, 14] as const,
        depth3D: 0.8,
        tilt: [-40, 40] as const,
        lifespan: 6000,
      },
      physics: {
        gravity: 0.18,
        drag: 0.045,
        wind: 0.08,
        windVariation: 0.04,
        wobble: true,
        wobbleSpeed: 2,
      },
      continuous: {
        recycle: true,
        numberOfPieces: 200,
      },
      spawnArea: { x: 0, y: 0, width: 1920, height: 0 },
    },
  },
  emoji: {
    name: 'emoji',
    description: 'Emoji celebration',
    options: {
      particleCount: 30,
      particle: {
        images: EMOJI_SETS.celebration.map(emoji => ({ src: emoji, isEmoji: true, scale: 1.5 })),
        size: [20, 30] as const,
        lifespan: 4000,
      },
      direction: {
        direction: 'up',
        spread: 60,
        velocity: [20, 35],
      },
    },
  },
  hearts: {
    name: 'hearts',
    description: 'Floating hearts',
    options: {
      particleCount: 50,
      particle: {
        colors: ['#FF69B4', '#FF1493', '#FF007F', '#DC143C', '#FFB6C1'],
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
        velocity: [10, 20],
      },
    },
  },
  stars: {
    name: 'stars',
    description: 'Shooting stars',
    options: {
      particleCount: 60,
      particle: {
        colors: ['#FFD700', '#FFFFFF'],
        shapes: ['star'] as const,
        size: [8, 16] as const,
        trail: { enabled: true, length: 12, fade: 0.4 },
      },
      direction: {
        direction: 'radial',
        spread: 360,
        velocity: [30, 60],
      },
    },
  },
  money: {
    name: 'money',
    description: 'Money rain',
    options: {
      particleCount: 40,
      particle: {
        colors: ['#85BB65', '#228B22', '#32CD32'],
        images: EMOJI_SETS.money.map(emoji => ({ src: emoji, isEmoji: true })),
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
        velocity: [25, 45],
      },
    },
  },
  christmas: {
    name: 'christmas',
    description: 'Christmas celebration',
    options: {
      particleCount: 80,
      particle: {
        colors: ['#C41E3A', '#165B33', '#FFD700', '#FFFFFF', '#BB2528'],
        shapes: ['star', 'circle'] as const,
        size: [8, 14] as const,
        images: EMOJI_SETS.christmas.map(emoji => ({ src: emoji, isEmoji: true })),
      },
    },
  },
  halloween: {
    name: 'halloween',
    description: 'Spooky Halloween',
    options: {
      particleCount: 60,
      particle: {
        colors: ['#FF6600', '#000000', '#8B008B', '#00FF00', '#FFD700'],
        shapes: ['circle', 'star'] as const,
        images: EMOJI_SETS.halloween.map(emoji => ({ src: emoji, isEmoji: true })),
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
        colors: ['#FFD700', '#DAA520', '#B8860B', '#FFC125', '#FFDF00', '#C0C0C0', '#A8A8A8'],
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
        colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'],
        shapes: ['star', 'circle', 'heart'] as const,
        images: EMOJI_SETS.birthday.map(emoji => ({ src: emoji, isEmoji: true })),
        size: [12, 20] as const,
        lifespan: 5000,
      },
      direction: {
        direction: 'up',
        spread: 80,
        velocity: [25, 45],
      },
    },
  },
} as const;

/**
 * Get a preset configuration by name
 */
export function getPreset(name: PresetName): PresetConfig {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`Preset "${name}" not found. Available presets: ${Object.keys(PRESETS).join(', ')}`);
  }
  return preset;
}

/**
 * Get all available preset names
 */
export function getPresetNames(): readonly PresetName[] {
  return Object.keys(PRESETS) as PresetName[];
}