/**
 * Particle class for confetti animation
 *
 * Represents a single confetti particle with all physics properties
 * and methods for updating and rendering.
 */
import type { ParticleState, ParticleShape, PhysicsConfig, ImageParticle, TrailConfig, GlowConfig, ColorInput, CustomDrawFunction } from './types';
/**
 * Loads an image and caches it
 */
export declare function loadImage(src: string): Promise<HTMLImageElement>;
/**
 * Clears the image cache
 */
export declare function clearImageCache(): void;
/**
 * Creates a new particle state object
 */
export declare function createParticle(x: number, y: number, angle: number, velocity: number, colors: readonly ColorInput[], shapes: readonly ParticleShape[], sizeRange: readonly [number, number], opacityRange: readonly [number, number], lifespan: number, rotationSpeed: number, options?: {
    images?: readonly ImageParticle[];
    tiltRange?: readonly [number, number];
    spinSpeedRange?: readonly [number, number];
    depth3D?: number;
}): ParticleState;
/**
 * Updates a particle's physics state
 */
export declare function updateParticle(particle: ParticleState, deltaTime: number, physics: PhysicsConfig, fadeOut: boolean, scaleDown: boolean, trailConfig?: Partial<TrailConfig>, canvasHeight?: number): void;
/**
 * Renders a particle to a canvas context
 */
export declare function renderParticle(ctx: CanvasRenderingContext2D, particle: ParticleState, options?: {
    trailConfig?: Partial<TrailConfig>;
    glowConfig?: Partial<GlowConfig>;
    customDraw?: CustomDrawFunction;
    elapsed?: number;
}): void;
/**
 * Checks if all particles in an array are inactive
 */
export declare function areAllParticlesInactive(particles: readonly ParticleState[]): boolean;
/**
 * Counts active particles
 */
export declare function countActiveParticles(particles: readonly ParticleState[]): number;
/**
 * Resets the particle ID counter (useful for testing)
 */
export declare function resetParticleIdCounter(): void;
//# sourceMappingURL=particle.d.ts.map