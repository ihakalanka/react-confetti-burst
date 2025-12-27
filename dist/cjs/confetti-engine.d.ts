/**
 * Confetti Engine - Core Canvas-based animation system
 *
 * This module provides the main confetti animation engine that manages
 * particle creation, physics updates, and rendering using the Canvas API.
 *
 * Features:
 * - High-performance requestAnimationFrame loop
 * - Automatic DPR (Device Pixel Ratio) handling
 * - Directional burst support
 * - Continuous/recycle mode (like react-confetti)
 * - Firework mode with secondary explosions
 * - Spawn area support
 * - Memory-efficient particle pooling
 * - Automatic cleanup
 */
import type { ConfettiBurstOptions, BurstOrigin, ExplosionHandle } from './types';
/**
 * Main confetti engine class
 */
export declare class ConfettiEngine {
    private particles;
    private config;
    private origin;
    private canvasContext;
    private animationFrameId;
    private lastFrameTime;
    private lastSpawnTime;
    private isRunning;
    private isPaused;
    private deferred;
    private mode;
    private spawnArea?;
    private continuousConfig;
    private fireworkConfig;
    private canvasConfig;
    private drawShape?;
    private frameInterval;
    private lastRenderTime;
    constructor(origin: BurstOrigin, options?: ConfettiBurstOptions);
    /**
     * Starts the confetti animation
     */
    start(): ExplosionHandle;
    /**
     * Creates particles for the burst
     */
    private createParticles;
    /**
     * Spawns particles for continuous mode
     */
    private spawnParticles;
    /**
     * Launches a firework
     */
    private launchFirework;
    /**
     * Triggers a firework explosion at a position
     */
    private explodeFirework;
    /**
     * Main animation loop
     */
    private animate;
    /**
     * Stops the animation immediately
     */
    stop(): void;
    /**
     * Pauses the animation
     */
    pause(): void;
    /**
     * Resumes a paused animation
     */
    resume(): void;
    /**
     * Called when animation completes naturally
     */
    private complete;
    /**
     * Cleans up resources
     */
    private cleanup;
    /**
     * Adds more particles to the animation
     */
    addParticles(count: number): void;
    /**
     * Clears all particles
     */
    clear(): void;
    /**
     * Gets current particle count
     */
    getParticleCount(): number;
    /**
     * Gets the current state
     */
    getState(): 'running' | 'paused' | 'stopped';
    /**
     * Creates the explosion handle for external control
     */
    private createHandle;
}
/**
 * Creates and starts a confetti explosion
 */
export declare function createConfettiExplosion(origin: BurstOrigin, options?: ConfettiBurstOptions): ExplosionHandle;
/**
 * Fires confetti from an element's center
 */
export declare function fireFromElement(element: HTMLElement | null, options?: ConfettiBurstOptions): ExplosionHandle | null;
/**
 * Gets the current number of active animations
 */
export declare function getActiveAnimationCount(): number;
/**
 * Forces cleanup of all resources
 */
export declare function forceCleanup(): void;
//# sourceMappingURL=confetti-engine.d.ts.map