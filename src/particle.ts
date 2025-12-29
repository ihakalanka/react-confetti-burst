/**
 * Particle class for confetti animation
 * 
 * Represents a single confetti particle with all physics properties
 * and methods for updating and rendering.
 */

import type {
  ParticleState,
  ParticleShape,
  RGBAColor,
  PhysicsConfig,
  ImageParticle,
  TrailConfig,
  GlowConfig,
  ColorInput,
  DrawContext,
  CustomDrawFunction,
} from './types';

import {
  randomInRange,
  randomFromArray,
  parseColor,
  degToRad,
  secureRandom,
  rgbaToString,
} from './utils';

import {
  PERFORMANCE,
  STAR_POINTS,
  STAR_INNER_RATIO,
  MATH_CONSTANTS,
  DEFAULT_TRAIL,
  DEFAULT_GLOW,
} from './constants';

/**
 * Internal particle ID counter
 */
let particleIdCounter = 0;

/**
 * Image cache for loaded images
 */
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Loads an image and caches it
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
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
export function clearImageCache(): void {
  imageCache.clear();
}

/**
 * Creates a new particle state object with realistic properties
 */
export function createParticle(
  x: number,
  y: number,
  angle: number,
  velocity: number,
  colors: readonly ColorInput[],
  shapes: readonly ParticleShape[],
  sizeRange: readonly [number, number],
  opacityRange: readonly [number, number],
  lifespan: number,
  rotationSpeed: number,
  options?: {
    images?: readonly ImageParticle[];
    tiltRange?: readonly [number, number];
    spinSpeedRange?: readonly [number, number];
    depth3D?: number;
    aspectRatioRange?: readonly [number, number];
  }
): ParticleState {
  const size = randomInRange(sizeRange[0], sizeRange[1]);
  const opacity = randomInRange(opacityRange[0], opacityRange[1]);
  const colorInput = randomFromArray(colors);
  const color = typeof colorInput === 'string' ? parseColor(colorInput) : 
    ('type' in colorInput) ? parseColor(colorInput.colors[0]) : colorInput as RGBAColor;

  // Calculate initial velocity components with slight randomization for natural spread
  const velocityVariation = 1 + (secureRandom() - 0.5) * 0.3; // ±15% velocity variation
  const vx = Math.cos(angle) * velocity * velocityVariation;
  const vy = -Math.sin(angle) * velocity * velocityVariation; // Negative because canvas Y is inverted

  // Handle image particles
  let image: ImageParticle | undefined;
  if (options?.images && options.images.length > 0) {
    image = randomFromArray(options.images);
  }

  const tiltRange = options?.tiltRange ?? [-30, 30];
  const spinSpeedRange = options?.spinSpeedRange ?? [-15, 15];
  const aspectRatioRange = options?.aspectRatioRange ?? [0.5, 1.5];

  // Random aspect ratio for varied paper-like shapes
  const aspectRatio = randomInRange(aspectRatioRange[0], aspectRatioRange[1]);

  return {
    id: particleIdCounter++,
    x,
    y,
    vx,
    vy,
    size,
    originalSize: size,
    rotation: secureRandom() * MATH_CONSTANTS.TWO_PI,
    rotationSpeed: (secureRandom() - 0.5) * 0.3 * rotationSpeed,
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
    wobbleSpeed: randomInRange(0.8, 2.5),
    tilt: degToRad(randomInRange(tiltRange[0], tiltRange[1])),
    tiltSpeed: randomInRange(spinSpeedRange[0], spinSpeedRange[1]) * 0.015,
    depth: options?.depth3D ?? 0.6,
    hasExploded: false,
    data: {},
    // New realistic properties
    flutterPhase: secureRandom() * MATH_CONSTANTS.TWO_PI,
    flutterSpeed: randomInRange(1.5, 3.5),
    swayPhase: secureRandom() * MATH_CONSTANTS.TWO_PI,
    aspectRatio,
    angularVelocity: (secureRandom() - 0.5) * 0.4,
    scaleX: 1,
    scaleY: 1,
    shimmerPhase: secureRandom() * MATH_CONSTANTS.TWO_PI,
    currentDrag: randomInRange(0.02, 0.05),
  };
}

/**
 * Updates a particle's physics state with realistic paper-like movement
 * OPTIMIZED: Reduced function calls, combined operations, faster math
 */
export function updateParticle(
  particle: ParticleState,
  deltaTime: number,
  physics: PhysicsConfig,
  fadeOut: boolean,
  scaleDown: boolean,
  trailConfig?: Partial<TrailConfig>,
  canvasHeight?: number
): void {
  if (!particle.active) return;

  const dt = deltaTime * 0.05988; // Pre-computed: deltaTime / 16.67

  // Update trail (store previous position) - only if enabled
  if (trailConfig?.enabled ?? DEFAULT_TRAIL.enabled) {
    const trail = particle.trail;
    trail.unshift({
      x: particle.x,
      y: particle.y,
      opacity: particle.opacity,
      size: particle.size,
    });
    const maxLength = trailConfig?.length ?? DEFAULT_TRAIL.length;
    if (trail.length > maxLength) {
      trail.pop();
    }
  }

  // OPTIMIZATION: Cache frequently accessed values
  let vx = particle.vx;
  let vy = particle.vy;
  const tilt = particle.tilt;
  
  // Calculate velocity magnitude (squared to avoid sqrt when possible)
  const speedSq = vx * vx + vy * vy;
  
  // Apply gravity with slight variation based on particle orientation
  // OPTIMIZATION: Use pre-computed sin approximation for small angles
  const sinTilt = tilt - (tilt * tilt * tilt) * 0.166667; // Taylor series approximation
  const gravityModifier = 1 + sinTilt * 0.15;
  vy += physics.gravity * gravityModifier * dt;

  // Flutter effect - paper-like oscillation
  const flutter = physics.flutter ?? true;
  if (flutter && speedSq > 1) {
    const flutterSpeed = physics.flutterSpeed ?? 2.5;
    const flutterIntensity = physics.flutterIntensity ?? 0.4;
    
    particle.flutterPhase += flutterSpeed * 0.05 * dt;
    // OPTIMIZATION: Fast sin approximation for flutter
    const flutterPhase = particle.flutterPhase;
    const sinFlutter = flutterPhase - (flutterPhase * flutterPhase * flutterPhase) * 0.166667;
    const flutterForce = sinFlutter * flutterIntensity * dt;
    
    // OPTIMIZATION: Use pre-computed cos approximation
    const cosTilt = 1 - (tilt * tilt) * 0.5;
    vx += flutterForce * cosTilt;
    
    // Paper sheets can catch air
    const absSinTilt = sinTilt < 0 ? -sinTilt : sinTilt;
    if (absSinTilt > 0.7) {
      const absFlutter = flutterForce < 0 ? -flutterForce : flutterForce;
      vy -= absFlutter * 0.3;
    }
  }

  // Sway effect - side-to-side movement
  const swayAmplitude = physics.swayAmplitude ?? 15;
  const swayFrequency = physics.swayFrequency ?? 2;
  particle.swayPhase += swayFrequency * 0.03 * dt;
  const swayPhase = particle.swayPhase;
  const swayForce = (swayPhase - (swayPhase * swayPhase * swayPhase) * 0.166667) * swayAmplitude * 0.01 * dt;
  vx += swayForce;

  // Apply wind with variation (use fast random)
  const windVariation = physics.windVariation;
  const windForce = physics.wind + (windVariation * (Math.random() - 0.5));
  vx += windForce * dt;

  // OPTIMIZATION: Combined drag calculation
  const airResistance = physics.airResistance ?? 0.03;
  const cosTilt = 1 - (tilt * tilt) * 0.5;
  const absCos = cosTilt < 0 ? -cosTilt : cosTilt;
  const totalDrag = physics.drag + absCos * airResistance;
  
  // OPTIMIZATION: Combined friction, decay, and drag in single multiplier
  const speed = speedSq > 0 ? Math.sqrt(speedSq) : 0;
  const dragFactor = Math.max(0.9, 1 - totalDrag * speed * 0.01);
  const combinedFactor = dragFactor * physics.friction * physics.decay;
  
  vx *= combinedFactor;
  vy *= combinedFactor;

  // Update position
  particle.x += vx * dt;
  particle.y += vy * dt;
  
  // Write back velocity
  particle.vx = vx;
  particle.vy = vy;

  // Update rotation with tumbling physics
  if (physics.tumble) {
    particle.angularVelocity = (particle.angularVelocity + vx * 0.001 * dt) * 0.98;
    particle.rotation += (particle.rotationSpeed + particle.angularVelocity) * dt;
  }

  // Update tilt - OPTIMIZATION: Use fast random
  particle.tiltSpeed = (particle.tiltSpeed + (Math.random() - 0.5) * 0.002 * dt) * 0.995;
  particle.tilt = (particle.tilt + particle.tiltSpeed * dt) % MATH_CONSTANTS.TWO_PI;

  // Update wobble phase for 3D effect
  if (physics.wobble) {
    const wobblePhase = particle.wobblePhase + physics.wobbleSpeed * 0.1 * dt;
    particle.wobblePhase = wobblePhase;
    
    // OPTIMIZATION: Fast abs(cos) and abs(sin) approximation
    const cosWobble = 1 - (wobblePhase * wobblePhase) * 0.5;
    const sinWobble = wobblePhase - (wobblePhase * wobblePhase * wobblePhase) * 0.166667;
    particle.scaleX = 0.3 + 0.7 * (cosWobble < 0 ? -cosWobble : cosWobble);
    particle.scaleY = 0.3 + 0.7 * (sinWobble < 0 ? -sinWobble : sinWobble);
  }

  // Update shimmer phase
  particle.shimmerPhase += 0.1 * dt;

  // Handle floor bounce
  if (physics.floor !== null && physics.bounce > 0 && canvasHeight) {
    const floorY = physics.floor ?? canvasHeight;
    const halfSize = particle.size * 0.5;
    if (particle.y + halfSize >= floorY) {
      particle.y = floorY - halfSize;
      particle.vy = -particle.vy * physics.bounce;
      particle.vx *= 0.85;
      particle.rotationSpeed += (Math.random() - 0.5) * 0.1;
    }
  }

  // Update life
  particle.life -= deltaTime;

  // Calculate life progress (0 = start, 1 = end)
  const lifeProgress = 1 - particle.life / particle.maxLife;

  // Apply fade out (smoother fade curve)
  if (fadeOut) {
    // OPTIMIZATION: Simplified smooth step
    const t = lifeProgress;
    const fadeProgress = t * t * (3 - 2 * t);
    particle.opacity = particle.originalOpacity * (1 - fadeProgress * 0.9);
  }

  // Apply scale down
  if (scaleDown) {
    particle.size = particle.originalSize * (1 - lifeProgress * 0.5);
  }

  // Check if particle is dead
  if (
    particle.life <= 0 ||
    particle.opacity < PERFORMANCE.MIN_OPACITY ||
    particle.size < PERFORMANCE.MIN_SIZE
  ) {
    particle.active = false;
  }
}

/**
 * Renders a particle to a canvas context with realistic 3D paper effect
 * OPTIMIZED: Reduced state changes, cached values, early exits
 */
export function renderParticle(
  ctx: CanvasRenderingContext2D,
  particle: ParticleState,
  options?: {
    trailConfig?: Partial<TrailConfig>;
    glowConfig?: Partial<GlowConfig>;
    customDraw?: CustomDrawFunction;
    elapsed?: number;
  }
): void {
  if (!particle.active) return;

  const { x, y, size, rotation, color, shape, opacity, tilt, aspectRatio, scaleX, scaleY, shimmerPhase } = particle;
  
  // OPTIMIZATION: Early exit for nearly invisible particles
  if (opacity < 0.02) return;
  
  const trail = options?.trailConfig;
  const glow = options?.glowConfig;

  // Render trail first (behind particle) - only if enabled and has trail data
  if ((trail?.enabled ?? DEFAULT_TRAIL.enabled) && particle.trail.length > 0) {
    renderTrail(ctx, particle, trail ?? DEFAULT_TRAIL);
  }

  ctx.save();

  // Apply glow effect only if enabled
  const glowEnabled = glow?.enabled ?? DEFAULT_GLOW.enabled;
  if (glowEnabled) {
    ctx.shadowBlur = glow?.blur ?? DEFAULT_GLOW.blur;
    ctx.shadowColor = glow?.color ?? rgbaToString(color);
  }

  ctx.translate(x, y);
  ctx.rotate(rotation + tilt);
  
  // Apply 3D flip/wobble effect with improved scaling
  const depth = particle.depth;
  if (depth > 0) {
    ctx.scale(scaleX, scaleY);
  }

  // OPTIMIZATION: Pre-calculate shimmer once
  const shimmerBrightness = 1 + (shimmerPhase - Math.floor(shimmerPhase)) * 0.3 - 0.15;
  
  // Calculate final opacity
  const orientationOpacity = 0.7 + 0.3 * (scaleX * scaleY < 0 ? -(scaleX * scaleY) : scaleX * scaleY);
  const finalOpacity = opacity * color.a * orientationOpacity * (glowEnabled ? (glow?.intensity ?? 1) : 1);
  
  // OPTIMIZATION: Skip if too transparent
  if (finalOpacity < 0.02) {
    ctx.restore();
    return;
  }
  
  ctx.globalAlpha = finalOpacity > 1 ? 1 : finalOpacity;
  
  // Apply shimmer to color - OPTIMIZATION: inline clamp
  const r = color.r * shimmerBrightness;
  const g = color.g * shimmerBrightness;
  const b = color.b * shimmerBrightness;
  ctx.fillStyle = `rgb(${r > 255 ? 255 : r},${g > 255 ? 255 : g},${b > 255 ? 255 : b})`;

  // Handle image/emoji particles
  if (particle.image && particle.image.isEmoji) {
    renderEmoji(ctx, particle.image.src, size * (particle.image.scale ?? 1));
  } else if (particle.imageElement) {
    renderImage(ctx, particle.imageElement, size * (particle.image?.scale ?? 1));
  } else if (shape === 'custom' && options?.customDraw) {
    const drawContext: DrawContext = {
      ctx,
      particle,
      progress: 1 - particle.life / particle.maxLife,
      elapsed: options.elapsed ?? 0,
    };
    options.customDraw(drawContext);
  } else {
    // OPTIMIZATION: Direct shape rendering with aspect ratio
    const effectiveAspectRatio = aspectRatio ?? 1;
    switch (shape) {
      case 'square':
      case 'rectangle':
        // Combined square/rectangle with aspect ratio
        const width = size * (shape === 'rectangle' ? Math.max(1.5, effectiveAspectRatio * 1.5) : Math.sqrt(effectiveAspectRatio));
        const height = size / (shape === 'rectangle' ? Math.max(1.5, effectiveAspectRatio) : Math.sqrt(effectiveAspectRatio));
        ctx.fillRect(-width * 0.5, -height * 0.5, width, height);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, MATH_CONSTANTS.TWO_PI);
        ctx.fill();
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
        // Default to rectangle
        ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
    }
  }

  ctx.restore();
}

/**
 * Renders the trail behind a particle
 */
function renderTrail(
  ctx: CanvasRenderingContext2D,
  particle: ParticleState,
  trail: Partial<TrailConfig>
): void {
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
 * Renders a triangle particle
 */
function renderTriangle(ctx: CanvasRenderingContext2D, size: number): void {
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
function renderStar(ctx: CanvasRenderingContext2D, size: number): void {
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
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Renders a line/streamer particle
 */
function renderLine(ctx: CanvasRenderingContext2D, size: number): void {
  const length = size * 2;
  const width = size / 4;
  ctx.fillRect(-length / 2, -width / 2, length, width);
}

/**
 * Renders a heart shape
 */
function renderHeart(ctx: CanvasRenderingContext2D, size: number): void {
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
function renderDiamond(ctx: CanvasRenderingContext2D, size: number): void {
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
function renderHexagon(ctx: CanvasRenderingContext2D, size: number): void {
  const radius = size / 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Renders a spiral shape
 */
function renderSpiral(ctx: CanvasRenderingContext2D, size: number, color: RGBAColor): void {
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
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

/**
 * Renders a ribbon/streamer shape
 */
function renderRibbon(ctx: CanvasRenderingContext2D, size: number): void {
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
function renderEmoji(ctx: CanvasRenderingContext2D, emoji: string, size: number): void {
  ctx.font = `${size}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, 0);
}

/**
 * Renders an image
 */
function renderImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, size: number): void {
  const halfSize = size / 2;
  ctx.drawImage(img, -halfSize, -halfSize, size, size);
}

/**
 * Checks if all particles in an array are inactive
 */
export function areAllParticlesInactive(particles: readonly ParticleState[]): boolean {
  return particles.every(p => !p.active);
}

/**
 * Counts active particles
 */
export function countActiveParticles(particles: readonly ParticleState[]): number {
  return particles.filter(p => p.active).length;
}

/**
 * Resets the particle ID counter (useful for testing)
 */
export function resetParticleIdCounter(): void {
  particleIdCounter = 0;
}
