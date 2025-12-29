/**
 * Particle class for confetti animation
 *
 * Represents a single confetti particle with all physics properties
 * and methods for updating and rendering.
 */
import { randomInRange, randomFromArray, parseColor, degToRad, secureRandom, clamp, rgbaToString, } from './utils';
import { PERFORMANCE, STAR_POINTS, STAR_INNER_RATIO, MATH_CONSTANTS, DEFAULT_TRAIL, DEFAULT_GLOW, } from './constants';
/**
 * Internal particle ID counter
 */
let particleIdCounter = 0;
/**
 * Image cache for loaded images
 */
const imageCache = new Map();
/**
 * Loads an image and caches it
 */
export function loadImage(src) {
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src));
    }
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}
/**
 * Clears the image cache
 */
export function clearImageCache() {
    imageCache.clear();
}
/**
 * Creates a new particle state object
 */
export function createParticle(x, y, angle, velocity, colors, shapes, sizeRange, opacityRange, lifespan, rotationSpeed, options) {
    const size = randomInRange(sizeRange[0], sizeRange[1]);
    const opacity = randomInRange(opacityRange[0], opacityRange[1]);
    const colorInput = randomFromArray(colors);
    const color = typeof colorInput === 'string' ? parseColor(colorInput) :
        ('type' in colorInput) ? parseColor(colorInput.colors[0]) : colorInput;
    // Calculate initial velocity components
    const vx = Math.cos(angle) * velocity;
    const vy = -Math.sin(angle) * velocity; // Negative because canvas Y is inverted
    // Handle image particles
    let image;
    if (options?.images && options.images.length > 0) {
        image = randomFromArray(options.images);
    }
    const tiltRange = options?.tiltRange ?? [-15, 15];
    const spinSpeedRange = options?.spinSpeedRange ?? [-10, 10];
    return {
        id: particleIdCounter++,
        x,
        y,
        vx,
        vy,
        size,
        originalSize: size,
        rotation: secureRandom() * MATH_CONSTANTS.TWO_PI,
        rotationSpeed: (secureRandom() - 0.5) * 0.2 * rotationSpeed,
        color,
        shape: image ? 'custom' : randomFromArray(shapes),
        opacity,
        originalOpacity: opacity,
        life: lifespan,
        maxLife: lifespan,
        active: true,
        image,
        imageElement: null,
        trail: [],
        wobblePhase: secureRandom() * MATH_CONSTANTS.TWO_PI,
        wobbleSpeed: randomInRange(0.5, 2),
        tilt: degToRad(randomInRange(tiltRange[0], tiltRange[1])),
        tiltSpeed: randomInRange(spinSpeedRange[0], spinSpeedRange[1]) * 0.01,
        depth: options?.depth3D ?? 0,
        hasExploded: false,
        data: {},
    };
}
/**
 * Updates a particle's physics state
 */
export function updateParticle(particle, deltaTime, physics, fadeOut, scaleDown, trailConfig, canvasHeight) {
    if (!particle.active)
        return;
    const dt = deltaTime / 16.67; // Normalize to 60fps
    // Update trail (store previous position)
    const trail = trailConfig ?? DEFAULT_TRAIL;
    if (trail.enabled) {
        particle.trail.unshift({
            x: particle.x,
            y: particle.y,
            opacity: particle.opacity,
            size: particle.size,
        });
        const maxLength = trail.length ?? DEFAULT_TRAIL.length;
        if (particle.trail.length > maxLength) {
            particle.trail.pop();
        }
    }
    // Apply gravity
    particle.vy += physics.gravity * dt;
    // Apply wind with variation
    const windForce = physics.wind + (physics.windVariation * (secureRandom() - 0.5));
    particle.vx += windForce * dt;
    // Apply drag
    particle.vx *= 1 - physics.drag;
    particle.vy *= 1 - physics.drag;
    // Apply friction
    particle.vx *= physics.friction;
    particle.vy *= physics.friction;
    // Apply velocity decay
    particle.vx *= physics.decay;
    particle.vy *= physics.decay;
    // Update position
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    // Update rotation
    if (physics.tumble) {
        particle.rotation += particle.rotationSpeed * dt;
    }
    // Update tilt
    particle.tilt += particle.tiltSpeed * dt;
    // Update wobble phase for 3D effect
    if (physics.wobble) {
        particle.wobblePhase += physics.wobbleSpeed * 0.1 * dt;
    }
    // Handle floor bounce
    if (physics.floor !== null && physics.bounce > 0 && canvasHeight) {
        const floorY = physics.floor ?? canvasHeight;
        if (particle.y + particle.size / 2 >= floorY) {
            particle.y = floorY - particle.size / 2;
            particle.vy = -particle.vy * physics.bounce;
            // Reduce horizontal velocity on bounce
            particle.vx *= 0.9;
        }
    }
    // Update life
    particle.life -= deltaTime;
    // Calculate life progress (0 = start, 1 = end)
    const lifeProgress = 1 - (particle.life / particle.maxLife);
    // Apply fade out
    if (fadeOut) {
        particle.opacity = particle.originalOpacity * (1 - lifeProgress);
    }
    // Apply scale down
    if (scaleDown) {
        particle.size = particle.originalSize * (1 - lifeProgress * 0.5);
    }
    // Check if particle is dead
    if (particle.life <= 0 ||
        particle.opacity < PERFORMANCE.MIN_OPACITY ||
        particle.size < PERFORMANCE.MIN_SIZE) {
        particle.active = false;
    }
}
/**
 * Renders a particle to a canvas context
 */
export function renderParticle(ctx, particle, options) {
    if (!particle.active)
        return;
    const { x, y, size, rotation, color, shape, opacity, tilt } = particle;
    const trail = options?.trailConfig ?? DEFAULT_TRAIL;
    const glow = options?.glowConfig ?? DEFAULT_GLOW;
    // Render trail first (behind particle)
    if (trail.enabled && particle.trail.length > 0) {
        renderTrail(ctx, particle, trail);
    }
    ctx.save();
    // Apply glow effect
    if (glow.enabled) {
        ctx.shadowBlur = glow.blur ?? DEFAULT_GLOW.blur;
        ctx.shadowColor = glow.color ?? rgbaToString(color);
    }
    ctx.translate(x, y);
    ctx.rotate(rotation + tilt);
    // Apply 3D wobble effect
    if (particle.depth > 0) {
        const wobbleScale = 1 - particle.depth * 0.3 * Math.sin(particle.wobblePhase);
        ctx.scale(wobbleScale, 1);
    }
    ctx.globalAlpha = clamp(opacity * color.a * (glow.enabled ? glow.intensity ?? 1 : 1), 0, 1);
    ctx.fillStyle = rgbaToString({ ...color, a: 1 });
    // Handle image/emoji particles
    if (particle.image && particle.image.isEmoji) {
        renderEmoji(ctx, particle.image.src, size * (particle.image.scale ?? 1));
    }
    else if (particle.imageElement) {
        renderImage(ctx, particle.imageElement, size * (particle.image?.scale ?? 1));
    }
    else if (shape === 'custom' && options?.customDraw) {
        const drawContext = {
            ctx,
            particle,
            progress: 1 - particle.life / particle.maxLife,
            elapsed: options.elapsed ?? 0,
        };
        options.customDraw(drawContext);
    }
    else {
        // Render based on shape
        switch (shape) {
            case 'square':
                renderSquare(ctx, size);
                break;
            case 'circle':
                renderCircle(ctx, size);
                break;
            case 'rectangle':
                renderRectangle(ctx, size);
                break;
            case 'triangle':
                renderTriangle(ctx, size);
                break;
            case 'star':
                renderStar(ctx, size);
                break;
            case 'line':
                renderLine(ctx, size);
                break;
            case 'heart':
                renderHeart(ctx, size);
                break;
            case 'diamond':
                renderDiamond(ctx, size);
                break;
            case 'hexagon':
                renderHexagon(ctx, size);
                break;
            case 'spiral':
                renderSpiral(ctx, size, color);
                break;
            case 'ribbon':
                renderRibbon(ctx, size);
                break;
            default:
                renderSquare(ctx, size);
        }
    }
    ctx.restore();
}
/**
 * Renders the trail behind a particle
 */
function renderTrail(ctx, particle, trail) {
    const fadeFactor = trail.fade ?? DEFAULT_TRAIL.fade;
    const widthFactor = trail.width ?? DEFAULT_TRAIL.width;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < particle.trail.length - 1; i++) {
        const current = particle.trail[i];
        const next = particle.trail[i + 1];
        const alpha = current.opacity * Math.pow(fadeFactor, i);
        const lineWidth = current.size * widthFactor * Math.pow(fadeFactor, i);
        if (alpha > 0.01 && lineWidth > 0.1) {
            ctx.beginPath();
            ctx.strokeStyle = rgbaToString({ ...particle.color, a: alpha });
            ctx.lineWidth = lineWidth;
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
        }
    }
    ctx.restore();
}
/**
 * Renders a square particle
 */
function renderSquare(ctx, size) {
    const halfSize = size / 2;
    ctx.fillRect(-halfSize, -halfSize, size, size);
}
/**
 * Renders a circle particle
 */
function renderCircle(ctx, size) {
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, MATH_CONSTANTS.TWO_PI);
    ctx.fill();
}
/**
 * Renders a rectangle particle (2:1 aspect ratio)
 */
function renderRectangle(ctx, size) {
    const width = size;
    const height = size / 2;
    ctx.fillRect(-width / 2, -height / 2, width, height);
}
/**
 * Renders a triangle particle
 */
function renderTriangle(ctx, size) {
    const halfSize = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -halfSize);
    ctx.lineTo(halfSize, halfSize);
    ctx.lineTo(-halfSize, halfSize);
    ctx.closePath();
    ctx.fill();
}
/**
 * Renders a star particle
 */
function renderStar(ctx, size) {
    const outerRadius = size / 2;
    const innerRadius = outerRadius * STAR_INNER_RATIO;
    const step = Math.PI / STAR_POINTS;
    ctx.beginPath();
    for (let i = 0; i < STAR_POINTS * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step - MATH_CONSTANTS.HALF_PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
}
/**
 * Renders a line/streamer particle
 */
function renderLine(ctx, size) {
    const length = size * 2;
    const width = size / 4;
    ctx.fillRect(-length / 2, -width / 2, length, width);
}
/**
 * Renders a heart shape
 */
function renderHeart(ctx, size) {
    const scale = size / 30;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(-10, -18, -25, -8, -15, 5);
    ctx.lineTo(0, 18);
    ctx.lineTo(15, 5);
    ctx.bezierCurveTo(25, -8, 10, -18, 0, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
/**
 * Renders a diamond shape
 */
function renderDiamond(ctx, size) {
    const halfSize = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -halfSize);
    ctx.lineTo(halfSize * 0.6, 0);
    ctx.lineTo(0, halfSize);
    ctx.lineTo(-halfSize * 0.6, 0);
    ctx.closePath();
    ctx.fill();
}
/**
 * Renders a hexagon shape
 */
function renderHexagon(ctx, size) {
    const radius = size / 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
}
/**
 * Renders a spiral shape
 */
function renderSpiral(ctx, size, color) {
    ctx.strokeStyle = rgbaToString(color);
    ctx.lineWidth = size / 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 22; i++) {
        const angle = 0.35 * i;
        const radius = (0.2 + 1.5 * angle) * (size / 20);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}
/**
 * Renders a ribbon/streamer shape
 */
function renderRibbon(ctx, size) {
    const width = size;
    const height = size / 3;
    const wave = size / 4;
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    ctx.quadraticCurveTo(-width / 4, -wave, 0, 0);
    ctx.quadraticCurveTo(width / 4, wave, width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.quadraticCurveTo(width / 4, height + wave, 0, height);
    ctx.quadraticCurveTo(-width / 4, height - wave, -width / 2, height);
    ctx.closePath();
    ctx.fill();
}
/**
 * Renders an emoji
 */
function renderEmoji(ctx, emoji, size) {
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 0, 0);
}
/**
 * Renders an image
 */
function renderImage(ctx, img, size) {
    const halfSize = size / 2;
    ctx.drawImage(img, -halfSize, -halfSize, size, size);
}
/**
 * Checks if all particles in an array are inactive
 */
export function areAllParticlesInactive(particles) {
    return particles.every(p => !p.active);
}
/**
 * Counts active particles
 */
export function countActiveParticles(particles) {
    return particles.filter(p => p.active).length;
}
/**
 * Resets the particle ID counter (useful for testing)
 */
export function resetParticleIdCounter() {
    particleIdCounter = 0;
}
