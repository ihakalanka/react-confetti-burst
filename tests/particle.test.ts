/**
 * Tests for particle system
 */

import {
  createParticle,
  updateParticle,
  areAllParticlesInactive,
  countActiveParticles,
  resetParticleIdCounter,
} from '../src/particle';

import { DEFAULT_PHYSICS } from '../src/constants';
import type { ParticleState } from '../src/types';

describe('createParticle', () => {
  beforeEach(() => {
    resetParticleIdCounter();
  });

  it('should create a particle with correct initial properties', () => {
    const particle = createParticle(
      100, // x
      200, // y
      Math.PI / 2, // angle (up)
      30, // velocity
      ['#FF0000'],
      ['square'],
      [10, 10],
      [1, 1],
      3000,
      1
    );

    expect(particle.x).toBe(100);
    expect(particle.y).toBe(200);
    expect(particle.size).toBe(10);
    expect(particle.originalSize).toBe(10);
    expect(particle.opacity).toBe(1);
    expect(particle.originalOpacity).toBe(1);
    expect(particle.life).toBe(3000);
    expect(particle.maxLife).toBe(3000);
    expect(particle.active).toBe(true);
    expect(particle.shape).toBe('square');
    expect(particle.color.r).toBe(255);
    expect(particle.color.g).toBe(0);
    expect(particle.color.b).toBe(0);
  });

  it('should assign incrementing IDs', () => {
    const p1 = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    const p2 = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    const p3 = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);

    expect(p1.id).toBe(0);
    expect(p2.id).toBe(1);
    expect(p3.id).toBe(2);
  });

  it('should calculate velocity based on angle with natural variation', () => {
    // Angle 0 (right) - velocity should be approximately 10 with ±15% variation
    const pRight = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    expect(pRight.vx).toBeGreaterThanOrEqual(8.5);  // 10 * 0.85
    expect(pRight.vx).toBeLessThanOrEqual(11.5);    // 10 * 1.15
    expect(pRight.vy).toBeCloseTo(0, 0);

    // Angle PI/2 (up) - velocity should be approximately -10 with ±15% variation
    const pUp = createParticle(0, 0, Math.PI / 2, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    expect(pUp.vx).toBeCloseTo(0, 0);
    expect(pUp.vy).toBeLessThanOrEqual(-8.5);  // -10 * 0.85
    expect(pUp.vy).toBeGreaterThanOrEqual(-11.5); // -10 * 1.15
  });

  it('should pick random size within range', () => {
    const sizes = new Set<number>();
    for (let i = 0; i < 100; i++) {
      const p = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 15], [1, 1], 1000, 1);
      sizes.add(p.size);
      expect(p.size).toBeGreaterThanOrEqual(5);
      expect(p.size).toBeLessThanOrEqual(15);
    }
    // Should have some variation
    expect(sizes.size).toBeGreaterThan(1);
  });

  it('should pick random shape from array', () => {
    const shapes = new Set<unknown>();
    const shapeOptions = ['square', 'circle', 'triangle'] as const;
    
    for (let i = 0; i < 100; i++) {
      const p = createParticle(0, 0, 0, 10, ['red'], shapeOptions, [5, 5], [1, 1], 1000, 1);
      shapes.add(p.shape);
    }
    
    // Should use multiple shapes
    expect(shapes.size).toBeGreaterThan(1);
    shapes.forEach(shape => {
      expect(shapeOptions).toContain(shape);
    });
  });
});

describe('updateParticle', () => {
  let particle: ParticleState;

  beforeEach(() => {
    resetParticleIdCounter();
    particle = createParticle(
      100, 100,
      0, // angle (right)
      10, // velocity
      ['#FF0000'],
      ['square'],
      [10, 10],
      [1, 1],
      3000,
      1
    );
  });

  it('should update position based on velocity', () => {
    const initialX = particle.x;
    const initialY = particle.y;

    updateParticle(particle, 16.67, DEFAULT_PHYSICS, false, false);

    expect(particle.x).not.toBe(initialX);
    expect(particle.y).not.toBe(initialY); // Gravity affects y
  });

  it('should apply gravity', () => {
    // Create a particle with minimal vertical velocity
    const testParticle = createParticle(100, 100, Math.PI / 2, 1, ['red'], ['square'], [10, 10], [1, 1], 3000, 1);
    const initialVy = testParticle.vy;
    
    // Use physics with strong gravity and minimal other effects
    const physics = { 
      ...DEFAULT_PHYSICS, 
      gravity: 2,
      flutter: false,
      swayAmplitude: 0,
    };

    // Run multiple updates to ensure gravity effect accumulates
    for (let i = 0; i < 20; i++) {
      updateParticle(testParticle, 16.67, physics, false, false);
    }

    // After multiple frames, gravity should have pulled particle down (vy increases in canvas coords)
    expect(testParticle.vy).toBeGreaterThan(initialVy);
  });

  it('should decrease life', () => {
    const initialLife = particle.life;

    updateParticle(particle, 100, DEFAULT_PHYSICS, false, false);

    expect(particle.life).toBe(initialLife - 100);
  });

  it('should fade out when enabled', () => {
    // Progress life to 50%
    particle.life = particle.maxLife * 0.5;
    updateParticle(particle, 0, DEFAULT_PHYSICS, true, false);

    expect(particle.opacity).toBeLessThan(particle.originalOpacity);
  });

  it('should scale down when enabled', () => {
    // Progress life to 50%
    particle.life = particle.maxLife * 0.5;
    updateParticle(particle, 0, DEFAULT_PHYSICS, false, true);

    expect(particle.size).toBeLessThan(particle.originalSize);
  });

  it('should deactivate when life reaches zero', () => {
    particle.life = 10;
    updateParticle(particle, 20, DEFAULT_PHYSICS, false, false);

    expect(particle.active).toBe(false);
  });

  it('should not update inactive particles', () => {
    particle.active = false;
    const initialX = particle.x;
    const initialY = particle.y;

    updateParticle(particle, 100, DEFAULT_PHYSICS, true, true);

    expect(particle.x).toBe(initialX);
    expect(particle.y).toBe(initialY);
  });

  it('should apply drag', () => {
    // Use physics with minimal other effects
    const physics = { 
      ...DEFAULT_PHYSICS, 
      drag: 0.5, 
      flutter: false,
      swayAmplitude: 0,
      wind: 0,
      windVariation: 0,
    };
    
    // Create a particle with specific velocity
    const testParticle = createParticle(100, 100, 0, 50, ['red'], ['square'], [10, 10], [1, 1], 3000, 1);
    const vx0 = Math.abs(testParticle.vx);
    
    // Apply multiple updates to see cumulative drag effect
    for (let i = 0; i < 20; i++) {
      updateParticle(testParticle, 16.67, physics, false, false);
    }
    
    // Velocity should decrease due to drag and friction
    expect(Math.abs(testParticle.vx)).toBeLessThan(vx0);
  });

  it('should apply wind', () => {
    // Test with high wind and minimal other effects
    const physics = { 
      ...DEFAULT_PHYSICS, 
      wind: 10,  // Strong wind
      windVariation: 0,
      flutter: false,
      swayAmplitude: 0,
      friction: 0.999, // Minimal friction
      decay: 1,
      drag: 0,
    };
    const particle1 = createParticle(100, 100, Math.PI / 2, 1, ['red'], ['square'], [10, 10], [1, 1], 3000, 1);
    const initialX = particle1.x;
    
    // Apply several updates
    for (let i = 0; i < 50; i++) {
      updateParticle(particle1, 16.67, physics, false, false);
    }

    // Wind should push particle to the right
    expect(particle1.x).toBeGreaterThan(initialX);
  });
});

describe('areAllParticlesInactive', () => {
  beforeEach(() => {
    resetParticleIdCounter();
  });

  it('should return true for empty array', () => {
    expect(areAllParticlesInactive([])).toBe(true);
  });

  it('should return true when all particles are inactive', () => {
    const particles: ParticleState[] = [
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
    ];

    expect(areAllParticlesInactive(particles)).toBe(true);
  });

  it('should return false when any particle is active', () => {
    const particles: ParticleState[] = [
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
    ];

    expect(areAllParticlesInactive(particles)).toBe(false);
  });
});

describe('countActiveParticles', () => {
  beforeEach(() => {
    resetParticleIdCounter();
  });

  it('should return 0 for empty array', () => {
    expect(countActiveParticles([])).toBe(0);
  });

  it('should count active particles correctly', () => {
    const particles: ParticleState[] = [
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
    ];

    expect(countActiveParticles(particles)).toBe(3);
  });
});
