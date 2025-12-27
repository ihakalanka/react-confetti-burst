/**
 * Tests for utility functions
 */

import {
  parseColor,
  rgbaToString,
  randomInRange,
  randomInt,
  randomFromArray,
  clamp,
  lerp,
  degToRad,
  radToDeg,
  getDirectionAngle,
  mergeConfig,
  isBrowser,
  getDevicePixelRatio,
  normalizeAngle,
  distance,
  validateRange,
} from '../src/utils';

import { DEFAULT_CONFIG } from '../src/constants';

describe('parseColor', () => {
  it('should parse 6-digit hex colors', () => {
    const color = parseColor('#FF6B6B');
    expect(color).toEqual({ r: 255, g: 107, b: 107, a: 1 });
  });

  it('should parse 3-digit hex colors', () => {
    const color = parseColor('#F00');
    expect(color).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('should parse 8-digit hex colors with alpha', () => {
    const color = parseColor('#FF6B6B80');
    expect(color.r).toBe(255);
    expect(color.g).toBe(107);
    expect(color.b).toBe(107);
    expect(color.a).toBeCloseTo(0.5, 1);
  });

  it('should parse rgb() colors', () => {
    const color = parseColor('rgb(255, 100, 50)');
    expect(color).toEqual({ r: 255, g: 100, b: 50, a: 1 });
  });

  it('should parse rgba() colors', () => {
    const color = parseColor('rgba(255, 100, 50, 0.5)');
    expect(color).toEqual({ r: 255, g: 100, b: 50, a: 0.5 });
  });

  it('should parse named colors', () => {
    const color = parseColor('red');
    expect(color).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('should handle RGBA object input', () => {
    const input = { r: 100, g: 150, b: 200, a: 0.8 };
    const color = parseColor(input);
    expect(color).toEqual(input);
  });

  it('should return transparent for invalid colors', () => {
    const color = parseColor('#invalid');
    expect(color.a).toBe(0);
  });
});

describe('rgbaToString', () => {
  it('should convert RGBA to CSS string', () => {
    const result = rgbaToString({ r: 255, g: 100, b: 50, a: 0.8 });
    expect(result).toBe('rgba(255, 100, 50, 0.8)');
  });
});

describe('randomInRange', () => {
  it('should return values within range', () => {
    for (let i = 0; i < 100; i++) {
      const value = randomInRange(10, 20);
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThanOrEqual(20);
    }
  });
});

describe('randomInt', () => {
  it('should return integers within range', () => {
    for (let i = 0; i < 100; i++) {
      const value = randomInt(1, 5);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
  });
});

describe('randomFromArray', () => {
  it('should return elements from the array', () => {
    const array = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 100; i++) {
      const value = randomFromArray(array);
      expect(array).toContain(value);
    }
  });

  it('should throw for empty array', () => {
    expect(() => randomFromArray([])).toThrow('Cannot pick from empty array');
  });
});

describe('clamp', () => {
  it('should clamp values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('lerp', () => {
  it('should interpolate between values', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(0, 100, 0.25)).toBe(25);
  });

  it('should clamp t value', () => {
    expect(lerp(0, 100, -0.5)).toBe(0);
    expect(lerp(0, 100, 1.5)).toBe(100);
  });
});

describe('degToRad / radToDeg', () => {
  it('should convert degrees to radians', () => {
    expect(degToRad(0)).toBe(0);
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    expect(degToRad(360)).toBeCloseTo(Math.PI * 2);
  });

  it('should convert radians to degrees', () => {
    expect(radToDeg(0)).toBe(0);
    expect(radToDeg(Math.PI)).toBeCloseTo(180);
    expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
  });
});

describe('getDirectionAngle', () => {
  it('should return correct angles for directions', () => {
    expect(getDirectionAngle('up')).toBeCloseTo(degToRad(90));
    expect(getDirectionAngle('down')).toBeCloseTo(degToRad(270));
    expect(getDirectionAngle('left')).toBeCloseTo(degToRad(180));
    expect(getDirectionAngle('right')).toBeCloseTo(degToRad(0));
  });

  it('should use custom angle when specified', () => {
    expect(getDirectionAngle('custom', 45)).toBeCloseTo(degToRad(45));
  });

  it('should return random angle for radial', () => {
    const angles = new Set<number>();
    for (let i = 0; i < 10; i++) {
      angles.add(getDirectionAngle('radial'));
    }
    // Should have multiple different angles
    expect(angles.size).toBeGreaterThan(1);
  });
});

describe('mergeConfig', () => {
  it('should return default config when no options provided', () => {
    const config = mergeConfig();
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('should merge partial options with defaults', () => {
    const config = mergeConfig({
      particleCount: 100,
      particle: { lifespan: 5000 },
    });

    expect(config.particleCount).toBe(100);
    expect(config.particle.lifespan).toBe(5000);
    expect(config.particle.colors).toEqual(DEFAULT_CONFIG.particle.colors);
    expect(config.physics).toEqual(DEFAULT_CONFIG.physics);
  });

  it('should merge deeply nested options', () => {
    const config = mergeConfig({
      physics: { gravity: 0.5 },
      direction: { spread: 60 },
    });

    expect(config.physics.gravity).toBe(0.5);
    expect(config.physics.drag).toBe(DEFAULT_CONFIG.physics.drag);
    expect(config.direction.spread).toBe(60);
    expect(config.direction.direction).toBe(DEFAULT_CONFIG.direction.direction);
  });
});

describe('isBrowser', () => {
  it('should return true in browser environment', () => {
    expect(isBrowser()).toBe(true);
  });
});

describe('getDevicePixelRatio', () => {
  it('should return device pixel ratio', () => {
    const dpr = getDevicePixelRatio();
    expect(dpr).toBeGreaterThanOrEqual(1);
  });

  it('should cap at max DPR', () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', { value: 4, configurable: true });
    
    expect(getDevicePixelRatio(2)).toBe(2);
    
    Object.defineProperty(window, 'devicePixelRatio', { value: originalDpr, configurable: true });
  });
});

describe('distance', () => {
  it('should calculate distance between points', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(distance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
    expect(distance({ x: 1, y: 1 }, { x: 4, y: 5 })).toBe(5);
  });
});

describe('normalizeAngle', () => {
  it('should normalize angles to 0-2π', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(Math.PI * 2)).toBeCloseTo(0);
    expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI);
    expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI);
  });
});

describe('validateRange', () => {
  it('should not throw for valid values', () => {
    expect(() => validateRange(5, 0, 10, 'test')).not.toThrow();
  });

  it('should throw for values out of range', () => {
    expect(() => validateRange(-1, 0, 10, 'test')).toThrow(RangeError);
    expect(() => validateRange(11, 0, 10, 'test')).toThrow(RangeError);
  });
});
