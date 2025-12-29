"use strict";
/**
 * Default constants and configuration values
 *
 * All default values are carefully tuned for optimal visual appeal
 * and performance across different devices and screen sizes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRESETS = exports.EMOJI_SETS = exports.COLOR_PALETTES = exports.STAR_INNER_RATIO = exports.STAR_POINTS = exports.CLEANUP_DELAY = exports.PERFORMANCE = exports.TRANSPARENT_COLOR = exports.SHAPE_ASPECT_RATIOS = exports.EASING_FUNCTIONS = exports.MATH_CONSTANTS = exports.DIRECTION_ANGLES = exports.DEFAULT_CONFIG = exports.DEFAULT_ACCESSIBILITY = exports.DEFAULT_CANVAS = exports.DEFAULT_FIREWORK = exports.DEFAULT_CONTINUOUS = exports.DEFAULT_GLOW = exports.DEFAULT_TRAIL = exports.DEFAULT_PARTICLE = exports.DEFAULT_DIRECTION = exports.DEFAULT_PHYSICS = exports.DEFAULT_COLORS = void 0;
exports.getPreset = getPreset;
/**
 * Default vibrant color palette for confetti particles
 * Designed for high visibility on both light and dark backgrounds
 */
exports.DEFAULT_COLORS = [
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
];
/**
 * Default physics configuration
 */
exports.DEFAULT_PHYSICS = {
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
};
/**
 * Default direction configuration
 */
exports.DEFAULT_DIRECTION = {
    direction: 'up',
    spread: 45,
    velocity: [20, 40],
};
/**
 * Default particle configuration
 */
exports.DEFAULT_PARTICLE = {
    colors: exports.DEFAULT_COLORS,
    shapes: ['square', 'circle'],
    size: [8, 12],
    opacity: [0.8, 1],
    lifespan: 3000,
    fadeOut: true,
    scaleDown: true,
    spin: true,
    spinSpeed: [-10, 10],
    tilt: [-15, 15],
    depth3D: 0,
};
/**
 * Default trail configuration
 */
exports.DEFAULT_TRAIL = {
    enabled: false,
    length: 10,
    fade: 0.5,
    width: 0.5,
};
/**
 * Default glow configuration
 */
exports.DEFAULT_GLOW = {
    enabled: false,
    blur: 10,
    color: null,
    intensity: 0.5,
};
/**
 * Default continuous mode configuration
 */
exports.DEFAULT_CONTINUOUS = {
    recycle: false,
    numberOfPieces: 200,
    spawnRate: 50,
    run: true,
    tweenDuration: 5000,
};
/**
 * Default firework configuration
 */
exports.DEFAULT_FIREWORK = {
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
};
/**
 * Default canvas configuration
 */
exports.DEFAULT_CANVAS = {
    width: null,
    height: null,
    autoResize: true,
    resizeDebounce: 100,
    frameRate: null,
    pixelRatio: null,
    useWorker: false,
    useOffscreen: false,
};
/**
 * Default accessibility configuration
 */
exports.DEFAULT_ACCESSIBILITY = {
    disableForReducedMotion: false,
    ariaLabel: 'Confetti animation',
    ariaHidden: true,
};
/**
 * Complete default configuration
 */
exports.DEFAULT_CONFIG = {
    particleCount: 50,
    particle: exports.DEFAULT_PARTICLE,
    physics: exports.DEFAULT_PHYSICS,
    direction: exports.DEFAULT_DIRECTION,
    mode: 'burst',
    easing: 'easeOut',
    zIndex: 9999,
    autoCleanup: true,
    scalar: 1,
    drift: 0,
    flat: false,
};
/**
 * Direction angles in degrees (0 = right, counter-clockwise)
 */
exports.DIRECTION_ANGLES = {
    up: 90,
    down: 270,
    left: 180,
    right: 0,
};
/**
 * Pre-calculated values for performance
 */
exports.MATH_CONSTANTS = {
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
};
/**
 * Easing functions for smooth animations
 */
exports.EASING_FUNCTIONS = {
    linear: (t) => t,
    easeIn: (t) => t * t * t,
    easeOut: (t) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t) => t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2,
    bounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        }
        else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        }
        else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        }
        else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    },
    elastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    back: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    circ: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    expo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
};
/**
 * Shape rendering aspect ratios
 */
exports.SHAPE_ASPECT_RATIOS = {
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
};
/**
 * Default transparent color for fallback
 */
exports.TRANSPARENT_COLOR = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
};
/**
 * Performance tuning constants
 */
exports.PERFORMANCE = {
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
};
/**
 * Canvas cleanup delay in milliseconds
 */
exports.CLEANUP_DELAY = 100;
/**
 * Star shape points configuration
 */
exports.STAR_POINTS = 5;
exports.STAR_INNER_RATIO = 0.5;
/**
 * Color palettes for presets
 */
exports.COLOR_PALETTES = {
    rainbow: exports.DEFAULT_COLORS,
    pride: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'],
    christmas: ['#C41E3A', '#165B33', '#FFD700', '#FFFFFF', '#BB2528'],
    halloween: ['#FF6600', '#000000', '#8B008B', '#00FF00', '#FFD700'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    neon: ['#FF00FF', '#00FFFF', '#FF0080', '#80FF00', '#FF8000'],
    gold: ['#FFD700', '#DAA520', '#B8860B', '#FFC125', '#FFDF00'],
    silver: ['#C0C0C0', '#A8A8A8', '#D3D3D3', '#DCDCDC', '#E8E8E8'],
    hearts: ['#FF69B4', '#FF1493', '#FF007F', '#DC143C', '#FFB6C1'],
    ocean: ['#006994', '#00CED1', '#20B2AA', '#48D1CC', '#87CEEB'],
};
/**
 * Emoji sets for presets
 */
exports.EMOJI_SETS = {
    celebration: ['🎉', '🎊', '🥳', '✨', '🎈'],
    hearts: ['❤️', '💕', '💖', '💗', '💓', '💘'],
    stars: ['⭐', '🌟', '✨', '💫', '⚡'],
    money: ['💰', '💵', '💸', '🤑', '💎'],
    christmas: ['🎄', '🎅', '🎁', '❄️', '⭐'],
    halloween: ['🎃', '👻', '🦇', '🕷️', '💀'],
    birthday: ['🎂', '🎁', '🎈', '🎉', '🥳'],
    food: ['🍕', '🍔', '🍟', '🌭', '🍿'],
};
/**
 * Preset configurations for quick setup
 */
exports.PRESETS = {
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
                colors: [...exports.COLOR_PALETTES.rainbow],
                shapes: ['square', 'circle', 'star'],
                size: [10, 15],
                lifespan: 4000,
            },
            direction: {
                direction: 'radial',
                spread: 360,
                velocity: [25, 50],
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
                colors: [...exports.COLOR_PALETTES.neon],
                shapes: ['circle', 'star'],
                size: [4, 8],
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
                shapes: ['circle'],
                size: [3, 8],
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
                shapes: ['line'],
                size: [2, 4],
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
                colors: [...exports.COLOR_PALETTES.gold],
                shapes: ['star'],
                size: [6, 12],
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
                shapes: ['square', 'rectangle'],
                size: [8, 14],
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
                images: exports.EMOJI_SETS.celebration.map(emoji => ({
                    src: emoji,
                    isEmoji: true,
                    scale: 1.5,
                })),
                size: [20, 30],
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
                colors: [...exports.COLOR_PALETTES.hearts],
                shapes: ['heart'],
                size: [12, 20],
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
                colors: [...exports.COLOR_PALETTES.gold, '#FFFFFF'],
                shapes: ['star'],
                size: [8, 16],
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
                images: exports.EMOJI_SETS.money.map(emoji => ({
                    src: emoji,
                    isEmoji: true,
                })),
                size: [20, 30],
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
                colors: [...exports.COLOR_PALETTES.pride],
                shapes: ['square', 'rectangle', 'heart'],
                size: [10, 16],
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
                colors: [...exports.COLOR_PALETTES.christmas],
                shapes: ['star', 'circle'],
                size: [8, 14],
                images: exports.EMOJI_SETS.christmas.map(emoji => ({
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
                colors: [...exports.COLOR_PALETTES.halloween],
                shapes: ['circle', 'star'],
                images: exports.EMOJI_SETS.halloween.map(emoji => ({
                    src: emoji,
                    isEmoji: true,
                })),
                size: [15, 25],
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
                colors: [...exports.COLOR_PALETTES.gold, ...exports.COLOR_PALETTES.silver],
                shapes: ['star', 'circle'],
                size: [6, 12],
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
                colors: [...exports.COLOR_PALETTES.pastel, ...exports.COLOR_PALETTES.rainbow],
                shapes: ['star', 'circle', 'heart'],
                images: exports.EMOJI_SETS.birthday.map(emoji => ({
                    src: emoji,
                    isEmoji: true,
                })),
                size: [12, 20],
                lifespan: 5000,
            },
            direction: {
                direction: 'up',
                spread: 80,
                velocity: [25, 45],
            },
        },
    },
};
/**
 * Get preset options by name
 */
function getPreset(name) {
    return exports.PRESETS[name].options;
}
