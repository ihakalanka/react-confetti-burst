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
  });

  it('should handle empty color array', () => {
    expect(() => {
      createParticle(0, 0, 0, 10, [], ['circle'], [5, 5], [1, 1], 1000, 1);
    }).toThrow('Colors array cannot be empty');
  });

  it('should handle empty shapes array', () => {
    expect(() => {
      createParticle(0, 0, 0, 10, ['red'], [], [5, 5], [1, 1], 1000, 1);
    }).toThrow('Shapes array cannot be empty');
  });

  it('should handle invalid size range', () => {
    expect(() => {
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [10, 5], [1, 1], 1000, 1);
    }).toThrow('Invalid size range');
  });

  it('should handle invalid opacity range', () => {
    expect(() => {
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 0.5], 1000, 1);
    }).toThrow('Invalid opacity range');
  });

  it('should handle negative velocity', () => {
    const particle = createParticle(0, 0, 0, -10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    expect(particle.vx).toBeLessThan(0);
    expect(particle.vy).toBeCloseTo(0, 0);
  });

  it('should handle zero velocity', () => {
    const particle = createParticle(0, 0, 0, 0, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    expect(particle.vx).toBeCloseTo(0, 1);
    expect(particle.vy).toBeCloseTo(0, 1);
  });

  it('should handle extreme angles', () => {
    // Test with very large angle (should wrap around)
    const particle1 = createParticle(0, 0, Math.PI * 4, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    const particle2 = createParticle(0, 0, Math.PI * 4 + Math.PI/2, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);

    // Should behave similarly to equivalent smaller angles (with some tolerance for velocity variation)
    // 4π is equivalent to 0, so particle1 should move right (positive vx)
    // 4π + π/2 is equivalent to π/2, so particle2 should move down (negative vy)
    expect(particle1.vx).toBeGreaterThan(5); // Should be around 10, but with variation
    expect(Math.abs(particle1.vy)).toBeLessThan(5); // Should be around 0
    expect(Math.abs(particle2.vx)).toBeLessThan(5); // Should be around 0
    expect(particle2.vy).toBeLessThan(-5); // Should be around -10
  });

  it('should handle custom particle options', () => {
    const particle = createParticle(
      100, 200,
      Math.PI / 4,
      15,
      ['#00FF00'],
      ['triangle'],
      [8, 12],
      [0.8, 1.0],
      5000,
      2,
      {
        tiltRange: [-0.5, 0.5],
        spinSpeedRange: [0.5, 1.5],
        depth3D: 0.3,
        aspectRatioRange: [0.5, 2.0]
      }
    );

    expect(particle.x).toBe(100);
    expect(particle.y).toBe(200);
    expect(particle.size).toBeGreaterThanOrEqual(8);
    expect(particle.size).toBeLessThanOrEqual(12);
    expect(particle.opacity).toBeGreaterThanOrEqual(0.8);
    expect(particle.opacity).toBeLessThanOrEqual(1.0);
    expect(particle.maxLife).toBe(5000);
    expect(Math.abs(particle.rotationSpeed)).toBeLessThan(0.5); // Randomized around 0 with rotationSpeed multiplier
    expect(particle.tilt).toBeGreaterThanOrEqual(-0.5);
    expect(particle.tilt).toBeLessThanOrEqual(0.5);
    expect(particle.aspectRatio).toBeGreaterThanOrEqual(0.5);
    expect(particle.aspectRatio).toBeLessThanOrEqual(2.0);
  });

  it('should handle image particles', () => {
    const particle = createParticle(
      0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1,
      {
        images: [{ src: 'test.png', isEmoji: false }]
      }
    );

    expect(particle.image).toBeDefined();
    expect(particle.image?.src).toBe('test.png');
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

  it('should handle zero delta time', () => {
    const initialX = particle.x;
    const initialY = particle.y;

    updateParticle(particle, 0, DEFAULT_PHYSICS, false, false);

    // Position should not change with zero delta time
    expect(particle.x).toBe(initialX);
    expect(particle.y).toBe(initialY);
  });

  it('should handle negative delta time', () => {
    const initialLife = particle.life;

    updateParticle(particle, -100, DEFAULT_PHYSICS, false, false);

    // Life should not decrease with negative delta time
    expect(particle.life).toBe(initialLife);
  });

  it('should handle very small particles', () => {
    const smallParticle = createParticle(0, 0, 0, 10, ['red'], ['circle'], [0.1, 0.1], [1, 1], 1000, 1);
    smallParticle.life = 10;

    updateParticle(smallParticle, 20, DEFAULT_PHYSICS, false, false);

    expect(smallParticle.active).toBe(false);
  });

  it('should handle very low opacity', () => {
    const fadedParticle = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [0.01, 0.01], 1000, 1);
    fadedParticle.life = 10;

    updateParticle(fadedParticle, 20, DEFAULT_PHYSICS, false, false);

    expect(fadedParticle.active).toBe(false);
  });

  it('should handle trail configuration', () => {
    const trailParticle = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);

    updateParticle(trailParticle, 16.67, DEFAULT_PHYSICS, false, false, {
      enabled: true,
      length: 5
    });

    expect(trailParticle.trail).toBeDefined();
    expect(trailParticle.trail!.length).toBeGreaterThan(0);
  });

  it('should handle canvas height for floor bounce', () => {
    const floorParticle = createParticle(0, 0, Math.PI, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
    floorParticle.y = 500; // Near bottom

    const physicsWithFloor = {
      ...DEFAULT_PHYSICS,
      floor: 0.8,
      bounce: 0.5
    };

    updateParticle(floorParticle, 16.67, physicsWithFloor, false, false, undefined, 600);

    // Should bounce when hitting floor
    expect(floorParticle.vy).toBeLessThan(0); // Bounced upward
  });

  it('should handle physics with extreme values', () => {
    const extremePhysics = {
      ...DEFAULT_PHYSICS,
      gravity: 10,
      friction: 0.99,
      drag: 0.1,
      wind: 5,
      flutter: true,
      flutterSpeed: 5,
      swayAmplitude: 50
    };

    updateParticle(particle, 16.67, extremePhysics, false, false);

    // Should not crash with extreme values
    expect(particle.active).toBe(true);
    expect(particle.x).toBeDefined();
    expect(particle.y).toBeDefined();
  });

  it('should handle concurrent fade and scale effects', () => {
    particle.life = particle.maxLife * 0.3; // 30% life remaining

    updateParticle(particle, 0, DEFAULT_PHYSICS, true, true);

    expect(particle.opacity).toBeLessThan(particle.originalOpacity);
    expect(particle.size).toBeLessThan(particle.originalSize);
  });

  it('should handle particles with zero mass/inertia', () => {
    // Create particle with minimal properties
    const minimalParticle = createParticle(0, 0, 0, 0.1, ['red'], ['circle'], [1, 1], [1, 1], 100, 1);

    updateParticle(minimalParticle, 16.67, DEFAULT_PHYSICS, false, false);

    // Should still function
    expect(minimalParticle.active).toBe(true);
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

  it('should handle null particles array', () => {
    expect(() => areAllParticlesInactive(null as any)).toThrow();
  });

  it('should handle undefined particles array', () => {
    expect(() => areAllParticlesInactive(undefined as any)).toThrow();
  });

  it('should handle mixed active/inactive states', () => {
    const particles: ParticleState[] = [
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
    ];

    expect(areAllParticlesInactive(particles)).toBe(false);
  });

  it('should handle single active particle', () => {
    const particles: ParticleState[] = [
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
    ];

    expect(areAllParticlesInactive(particles)).toBe(false);
  });

  it('should handle single inactive particle', () => {
    const particles: ParticleState[] = [
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
    ];

    expect(areAllParticlesInactive(particles)).toBe(true);
  });
});

describe('countActiveParticles', () => {
  beforeEach(() => {
    resetParticleIdCounter();
  });

  it('should return 0 for empty array', () => {
    expect(countActiveParticles([])).toBe(0);
  });

  it('should handle null particles array', () => {
    expect(() => countActiveParticles(null as any)).toThrow();
  });

  it('should handle undefined particles array', () => {
    expect(() => countActiveParticles(undefined as any)).toThrow();
  });

  it('should handle all inactive particles', () => {
    const particles: ParticleState[] = [
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: false },
    ];

    expect(countActiveParticles(particles)).toBe(0);
  });

  it('should handle large arrays', () => {
    const particles: ParticleState[] = [];
    const expectedActive = 500;

    for (let i = 0; i < 1000; i++) {
      const particle = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);
      if (i < expectedActive) {
        // Keep first 500 active
        particle.active = true;
      } else {
        particle.active = false;
      }
      particles.push(particle);
    }

    expect(countActiveParticles(particles)).toBe(expectedActive);
  });

  it('should handle particles with undefined active state', () => {
    const particles: ParticleState[] = [
      { ...createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1), active: undefined as any },
      createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1),
    ];

    // Should treat undefined as inactive (falsy)
    expect(countActiveParticles(particles)).toBe(1);
  });
});
