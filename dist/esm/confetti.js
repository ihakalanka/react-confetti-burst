/**
 * Functional Confetti API
 *
 * Provides a canvas-confetti compatible function-based API for
 * imperative confetti control without React components.
 *
 * @module confetti
 */
/**
 * Global registry of confetti instances
 */
const instances = new Map();
/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    if (typeof window === 'undefined')
        return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
/**
 * Create a random particle
 */
function createParticle(canvas, options) {
    const { angle = 90, spread = 45, startVelocity = 45, decay = 0.9, gravity = 1, drift = 0, flat = false, ticks = 200, origin = { x: 0.5, y: 0.5 }, colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'], shapes = ['square', 'circle'], scalar = 1, } = options;
    const radAngle = (angle - 90) * (Math.PI / 180);
    const spreadRad = spread * (Math.PI / 180);
    const randomAngle = radAngle + (Math.random() - 0.5) * spreadRad;
    const velocity = startVelocity * (0.5 + Math.random() * 0.5);
    return {
        x: origin.x * canvas.width,
        y: origin.y * canvas.height,
        vx: Math.cos(randomAngle) * velocity,
        vy: Math.sin(randomAngle) * velocity,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: (shapes[Math.floor(Math.random() * shapes.length)] ?? 'circle'),
        scalar,
        gravity: gravity * 0.5,
        drift,
        decay,
        flat,
        tick: 0,
        totalTicks: ticks,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.1 + Math.random() * 0.1,
    };
}
/**
 * Update particle physics
 */
function updateParticle(particle) {
    particle.tick++;
    if (particle.tick >= particle.totalTicks) {
        return false;
    }
    // Apply physics
    particle.vy += particle.gravity;
    particle.vx += particle.drift;
    particle.vx *= particle.decay;
    particle.vy *= particle.decay;
    particle.x += particle.vx;
    particle.y += particle.vy;
    // Update wobble and tilt
    particle.wobble += particle.wobbleSpeed;
    if (!particle.flat) {
        particle.tiltAngle += particle.tiltSpeed;
    }
    return true;
}
/**
 * Draw a single particle
 */
function drawParticle(ctx, particle) {
    const progress = particle.tick / particle.totalTicks;
    const fadeOut = 1 - progress;
    const size = 10 * particle.scalar;
    ctx.save();
    ctx.translate(particle.x, particle.y);
    if (!particle.flat) {
        ctx.rotate(particle.tiltAngle);
        // Add wobble for 3D effect
        const wobbleX = Math.sin(particle.wobble) * 0.5;
        ctx.scale(1 + wobbleX * 0.2, 1);
    }
    ctx.globalAlpha = fadeOut;
    ctx.fillStyle = particle.color;
    if (particle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (particle.shape === 'square') {
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }
    else {
        // Rectangle (default)
        ctx.fillRect(-size / 2, -size / 3, size, size * 0.6);
    }
    ctx.restore();
}
/**
 * Animation loop for a confetti instance
 */
function animate(instance) {
    if (instance.isDestroyed) {
        return;
    }
    const { canvas, ctx, particles } = instance;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        const alive = updateParticle(particle);
        if (alive) {
            drawParticle(ctx, particle);
        }
        else {
            particles.splice(i, 1);
        }
    }
    // Continue animation or resolve
    if (particles.length > 0) {
        instance.animationId = requestAnimationFrame(() => animate(instance));
    }
    else {
        instance.animationId = null;
        instance.resolve?.();
        instance.resolve = null;
        instance.promise = null;
    }
}
/**
 * Get or create the default canvas
 */
function getDefaultCanvas() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483647;
    `;
        document.body.appendChild(canvas);
    }
    // Update size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas;
}
/**
 * Get or create a confetti instance
 */
function getInstance(canvas, createOptions = {}) {
    let instance = instances.get(canvas);
    if (!instance) {
        const actualCanvas = canvas === 'default' ? getDefaultCanvas() : canvas;
        const ctx = actualCanvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context from canvas');
            return null;
        }
        instance = {
            canvas: actualCanvas,
            ctx,
            animationId: null,
            particles: [],
            options: createOptions,
            promise: null,
            resolve: null,
            isDestroyed: false,
        };
        instances.set(canvas, instance);
        // Handle resize if enabled
        if (createOptions.resize && canvas === 'default') {
            window.addEventListener('resize', () => {
                if (!instance.isDestroyed) {
                    instance.canvas.width = window.innerWidth;
                    instance.canvas.height = window.innerHeight;
                }
            });
        }
    }
    return instance;
}
/**
 * Main confetti function - canvas-confetti compatible API
 *
 * @example
 * ```typescript
 * // Basic confetti burst
 * confetti();
 *
 * // Customized confetti
 * confetti({
 *   particleCount: 100,
 *   spread: 70,
 *   origin: { x: 0.5, y: 0.5 }
 * });
 *
 * // Wait for completion
 * await confetti({ particleCount: 200 });
 * console.log('Confetti finished!');
 * ```
 *
 * @param options - Confetti configuration options
 * @returns Promise that resolves when animation completes
 */
export function confetti(options = {}) {
    // Check for reduced motion preference
    if (options.disableForReducedMotion && prefersReducedMotion()) {
        return Promise.resolve();
    }
    const instance = getInstance('default');
    if (!instance) {
        return null;
    }
    const { particleCount = 50, } = options;
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        instance.particles.push(createParticle(instance.canvas, options));
    }
    // Start animation if not already running
    if (!instance.animationId) {
        instance.promise = new Promise(resolve => {
            instance.resolve = resolve;
        });
        instance.animationId = requestAnimationFrame(() => animate(instance));
    }
    return instance.promise;
}
/**
 * Create a confetti instance bound to a specific canvas
 *
 * @example
 * ```typescript
 * // Custom canvas confetti
 * const myCanvas = document.getElementById('my-canvas');
 * const myConfetti = confetti.create(myCanvas, { resize: true });
 *
 * // Use the custom instance
 * myConfetti({ particleCount: 100 });
 *
 * // Reset/clear the custom instance
 * myConfetti.reset();
 * ```
 *
 * @param canvas - Target canvas element
 * @param globalOptions - Global options for this instance
 * @returns Confetti function bound to the canvas
 */
confetti.create = function (canvas, globalOptions = {}) {
    const instance = getInstance(canvas, globalOptions);
    const fire = (options = {}) => {
        if (!instance || instance.isDestroyed) {
            return null;
        }
        // Check for reduced motion preference
        const disableForReducedMotion = options.disableForReducedMotion ?? globalOptions.disableForReducedMotion;
        if (disableForReducedMotion && prefersReducedMotion()) {
            return Promise.resolve();
        }
        const { particleCount = 50, } = options;
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            instance.particles.push(createParticle(instance.canvas, options));
        }
        // Start animation if not already running
        if (!instance.animationId) {
            instance.promise = new Promise(resolve => {
                instance.resolve = resolve;
            });
            instance.animationId = requestAnimationFrame(() => animate(instance));
        }
        return instance.promise;
    };
    fire.reset = () => {
        if (instance) {
            if (instance.animationId) {
                cancelAnimationFrame(instance.animationId);
                instance.animationId = null;
            }
            instance.particles = [];
            instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
            instance.resolve?.();
            instance.resolve = null;
            instance.promise = null;
        }
    };
    return fire;
};
/**
 * Reset/clear all confetti on the default canvas
 *
 * @example
 * ```typescript
 * // Fire some confetti
 * confetti({ particleCount: 100 });
 *
 * // Clear it immediately
 * confetti.reset();
 * ```
 */
confetti.reset = function () {
    const instance = instances.get('default');
    if (instance) {
        if (instance.animationId) {
            cancelAnimationFrame(instance.animationId);
            instance.animationId = null;
        }
        instance.particles = [];
        instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
        instance.resolve?.();
        instance.resolve = null;
        instance.promise = null;
    }
};
/**
 * Fire confetti from both sides (common celebration pattern)
 *
 * @example
 * ```typescript
 * // Celebration from both corners
 * confetti.fireworks();
 * ```
 */
confetti.fireworks = async function (options = {}) {
    const baseOptions = {
        particleCount: 30,
        spread: 55,
        ...options,
    };
    await Promise.all([
        confetti({
            ...baseOptions,
            angle: 60,
            origin: { x: 0, y: 0.65 },
        }),
        confetti({
            ...baseOptions,
            angle: 120,
            origin: { x: 1, y: 0.65 },
        }),
    ]);
};
/**
 * Fire confetti in a school pride pattern
 *
 * @example
 * ```typescript
 * // School colors celebration
 * confetti.schoolPride({ colors: ['#ff0000', '#ffffff'] });
 * ```
 */
confetti.schoolPride = function (options = {}) {
    const end = Date.now() + 3000;
    const colors = options.colors ?? ['#bb0000', '#ffffff'];
    function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors,
            ...options,
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors,
            ...options,
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }
    frame();
};
/**
 * Fire confetti in a snow pattern
 *
 * @example
 * ```typescript
 * confetti.snow({ duration: 5000 });
 * ```
 */
confetti.snow = function (options = {}) {
    const { duration = 5000, ...confettiOptions } = options;
    const end = Date.now() + duration;
    function frame() {
        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: 300,
            gravity: 0.3,
            origin: {
                x: Math.random(),
                y: 0,
            },
            colors: ['#ffffff', '#f0f8ff', '#e6f3ff'],
            shapes: ['circle'],
            scalar: 0.8 + Math.random() * 0.4,
            drift: Math.random() - 0.5,
            ...confettiOptions,
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }
    frame();
};
/**
 * Fire realistic looking firework bursts
 *
 * @example
 * ```typescript
 * confetti.burst({ x: 0.5, y: 0.3 });
 * ```
 */
confetti.burst = function (origin, options = {}) {
    return confetti({
        particleCount: 80,
        spread: 360,
        startVelocity: 30,
        decay: 0.92,
        scalar: 1.2,
        origin,
        ...options,
    });
};
// Make confetti the default export
export default confetti;
//# sourceMappingURL=confetti.js.map