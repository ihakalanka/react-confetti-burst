/**
 * Integration and edge case tests
 */

import {
  createConfettiExplosion,
  getActiveAnimationCount,
  forceCleanup,
  setMaxPoolSize,
  getMaxPoolSize,
} from '../src/confetti-engine';

import { createParticle, resetParticleIdCounter } from '../src/particle';
import { mergeConfig, parseColor, isBrowser } from '../src/utils';
import { DEFAULT_PHYSICS } from '../src/constants';

// These tests require browser mocks from setup.ts

describe('Multiple simultaneous bursts', () => {
  beforeEach(() => {
    forceCleanup();
  });

  afterEach(() => {
    forceCleanup();
  });

  it('should track active animation count', () => {
    expect(getActiveAnimationCount()).toBe(0);

    const handle1 = createConfettiExplosion({ x: 100, y: 100 });
    expect(getActiveAnimationCount()).toBe(1);

    const handle2 = createConfettiExplosion({ x: 200, y: 200 });
    expect(getActiveAnimationCount()).toBe(2);

    const handle3 = createConfettiExplosion({ x: 300, y: 300 });
    expect(getActiveAnimationCount()).toBe(3);

    // Stop all
    handle1.stop();
    handle2.stop();
    handle3.stop();
  });

  it('should decrement count when animations stop', () => {
    const handle1 = createConfettiExplosion({ x: 100, y: 100 });
    const handle2 = createConfettiExplosion({ x: 200, y: 200 });

    expect(getActiveAnimationCount()).toBe(2);

    handle1.stop();
    expect(getActiveAnimationCount()).toBe(1);

    handle2.stop();
    expect(getActiveAnimationCount()).toBe(0);
  });

  it('forceCleanup should clear all animations', () => {
    createConfettiExplosion({ x: 100, y: 100 });
    createConfettiExplosion({ x: 200, y: 200 });
    createConfettiExplosion({ x: 300, y: 300 });

    expect(getActiveAnimationCount()).toBe(3);

    forceCleanup();
    expect(getActiveAnimationCount()).toBe(0);
  });

  it('should handle rapid fire-and-stop cycles', () => {
    for (let i = 0; i < 10; i++) {
      const handle = createConfettiExplosion({ x: i * 100, y: 100 });
      handle.stop();
    }

    expect(getActiveAnimationCount()).toBe(0);
  });
});

describe('Configurable pool size', () => {
  afterEach(() => {
    setMaxPoolSize(500); // Reset to default
  });

  it('should default to 500', () => {
    expect(getMaxPoolSize()).toBe(500);
  });

  it('should allow setting pool size', () => {
    setMaxPoolSize(100);
    expect(getMaxPoolSize()).toBe(100);
  });

  it('should clamp to minimum of 1', () => {
    setMaxPoolSize(0);
    expect(getMaxPoolSize()).toBe(1);

    setMaxPoolSize(-10);
    expect(getMaxPoolSize()).toBe(1);
  });

  it('should floor fractional values', () => {
    setMaxPoolSize(99.7);
    expect(getMaxPoolSize()).toBe(99);
  });
});

describe('Edge cases: particle creation', () => {
  beforeEach(() => {
    resetParticleIdCounter();
  });

  it('should handle particleCount of 0 in config', () => {
    const config = mergeConfig({ particleCount: 0 });
    expect(config.particleCount).toBe(0);
  });

  it('should handle very large particleCount', () => {
    const config = mergeConfig({ particleCount: 10000 });
    expect(config.particleCount).toBe(10000);
  });

  it('should handle extreme physics values without crashing', () => {
    const particle = createParticle(0, 0, 0, 10, ['red'], ['circle'], [5, 5], [1, 1], 1000, 1);

    const extremePhysics = {
      ...DEFAULT_PHYSICS,
      gravity: 100,
      drag: 1.0,
      wind: 50,
      windVariation: 10,
    };

    // Should not throw
    expect(() => {
      for (let i = 0; i < 100; i++) {
        const { updateParticle } = require('../src/particle');
        updateParticle(particle, 16.67, extremePhysics, false, false);
      }
    }).not.toThrow();
  });
});

describe('Edge cases: color parsing', () => {
  it('should handle invalid hex colors gracefully', () => {
    const color = parseColor('#xyz');
    expect(color.a).toBe(0); // transparent fallback
  });

  it('should handle empty string', () => {
    const color = parseColor('');
    // Should not throw, returns transparent or named fallback
    expect(color).toBeDefined();
  });

  it('should handle 3-digit hex', () => {
    const color = parseColor('#f00');
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(0);
  });

  it('should handle 8-digit hex with alpha', () => {
    const color = parseColor('#ff000080');
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(0);
    expect(color.a).toBeCloseTo(0.502, 1); // 128/255
  });

  it('should handle rgb() format', () => {
    const color = parseColor('rgb(100, 200, 50)');
    expect(color.r).toBe(100);
    expect(color.g).toBe(200);
    expect(color.b).toBe(50);
    expect(color.a).toBe(1);
  });

  it('should handle rgba() format', () => {
    const color = parseColor('rgba(100, 200, 50, 0.5)');
    expect(color.r).toBe(100);
    expect(color.g).toBe(200);
    expect(color.b).toBe(50);
    expect(color.a).toBe(0.5);
  });

  it('should handle named colors', () => {
    const red = parseColor('red');
    expect(red.r).toBe(255);
    expect(red.g).toBe(0);
    expect(red.b).toBe(0);
  });

  it('should handle RGBAColor object input', () => {
    const color = parseColor({ r: 128, g: 64, b: 32, a: 0.8 });
    expect(color.r).toBe(128);
    expect(color.g).toBe(64);
    expect(color.b).toBe(32);
    expect(color.a).toBe(0.8);
  });

  it('should clamp out-of-range RGBAColor values', () => {
    const color = parseColor({ r: 300, g: -10, b: 128, a: 1.5 });
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(128);
    expect(color.a).toBe(1);
  });
});

describe('Edge cases: mergeConfig', () => {
  it('should return defaults when no options provided', () => {
    const config = mergeConfig();
    expect(config.particleCount).toBe(50);
    expect(config.physics.gravity).toBeDefined();
    expect(config.particle.colors.length).toBeGreaterThan(0);
  });

  it('should merge partial physics', () => {
    const config = mergeConfig({ physics: { gravity: 5 } });
    expect(config.physics.gravity).toBe(5);
    expect(config.physics.drag).toBe(0.035); // default preserved
  });

  it('should merge partial particle config', () => {
    const config = mergeConfig({ particle: { colors: ['#000'] } });
    expect(config.particle.colors).toEqual(['#000']);
    expect(config.particle.shapes).toBeDefined(); // default preserved
  });

  it('should handle undefined options', () => {
    const config = mergeConfig(undefined);
    expect(config).toBeDefined();
    expect(config.particleCount).toBe(50);
  });

  it('should handle empty object', () => {
    const config = mergeConfig({});
    expect(config.particleCount).toBe(50);
  });
});

describe('Edge cases: SSR environment', () => {
  it('isBrowser should return true in jsdom', () => {
    // jsdom provides window and document
    expect(isBrowser()).toBe(true);
  });
});

describe('ExplosionHandle API', () => {
  beforeEach(() => {
    forceCleanup();
  });

  afterEach(() => {
    forceCleanup();
  });

  it('should provide all handle methods', () => {
    const handle = createConfettiExplosion({ x: 100, y: 100 });

    expect(typeof handle.stop).toBe('function');
    expect(typeof handle.pause).toBe('function');
    expect(typeof handle.resume).toBe('function');
    expect(typeof handle.addParticles).toBe('function');
    expect(typeof handle.clear).toBe('function');
    expect(typeof handle.getParticleCount).toBe('function');
    expect(typeof handle.getState).toBe('function');
    expect(handle.promise).toBeInstanceOf(Promise);

    handle.stop();
  });

  it('should report running state', () => {
    const handle = createConfettiExplosion({ x: 100, y: 100 });
    expect(handle.getState()).toBe('running');
    handle.stop();
  });

  it('should report stopped state after stop', () => {
    const handle = createConfettiExplosion({ x: 100, y: 100 });
    handle.stop();
    expect(handle.getState()).toBe('stopped');
  });

  it('should report paused state after pause', () => {
    const handle = createConfettiExplosion({ x: 100, y: 100 });
    handle.pause();
    expect(handle.getState()).toBe('paused');
    handle.stop();
  });

  it('should resume after pause', () => {
    const handle = createConfettiExplosion({ x: 100, y: 100 });
    handle.pause();
    expect(handle.getState()).toBe('paused');
    handle.resume();
    expect(handle.getState()).toBe('running');
    handle.stop();
  });

  it('stop should be idempotent', () => {
    const handle = createConfettiExplosion({ x: 100, y: 100 });
    handle.stop();
    expect(() => handle.stop()).not.toThrow();
  });
});
