/**
 * Tests for preset configurations
 */

import { PRESETS, getPreset, getPresetNames, COLOR_PALETTES, EMOJI_SETS } from '../src/presets';
import { mergeConfig } from '../src/utils';
import type { PresetName } from '../src/types';

describe('getPresetNames', () => {
  it('should return all 16 preset names', () => {
    const names = getPresetNames();
    expect(names).toHaveLength(16);
  });

  it('should include all expected preset names', () => {
    const names = getPresetNames();
    const expected: PresetName[] = [
      'default', 'celebration', 'firework', 'snow', 'rain',
      'sparkle', 'confetti', 'emoji', 'hearts', 'stars',
      'money', 'pride', 'christmas', 'halloween', 'newYear', 'birthday',
    ];
    expected.forEach(name => {
      expect(names).toContain(name);
    });
  });

  it('should return an array (not null/undefined)', () => {
    const names = getPresetNames();
    expect(Array.isArray(names)).toBe(true);
  });
});

describe('getPreset', () => {
  it('should return a valid preset for each name', () => {
    const names = getPresetNames();
    names.forEach(name => {
      const preset = getPreset(name);
      expect(preset).toBeDefined();
      expect(preset.name).toBe(name);
      expect(preset.description).toBeTruthy();
      expect(preset.options).toBeDefined();
    });
  });

  it('should throw for invalid preset name', () => {
    expect(() => getPreset('nonexistent' as PresetName)).toThrow('not found');
  });

  it('should return preset with correct structure', () => {
    const preset = getPreset('default');
    expect(preset).toHaveProperty('name');
    expect(preset).toHaveProperty('description');
    expect(preset).toHaveProperty('options');
  });
});

describe('preset configurations', () => {
  it('each preset options should be mergeable with mergeConfig without error', () => {
    const names = getPresetNames();
    names.forEach(name => {
      const preset = getPreset(name);
      expect(() => mergeConfig(preset.options)).not.toThrow();
    });
  });

  it('default preset should have particleCount', () => {
    const preset = getPreset('default');
    expect(preset.options.particleCount).toBeGreaterThan(0);
  });

  it('celebration preset should have high particle count', () => {
    const preset = getPreset('celebration');
    expect(preset.options.particleCount).toBeGreaterThanOrEqual(100);
  });

  it('snow preset should use continuous mode', () => {
    const preset = getPreset('snow');
    expect(preset.options.mode).toBe('snow');
    expect(preset.options.continuous?.recycle).toBe(true);
  });

  it('rain preset should use rain mode', () => {
    const preset = getPreset('rain');
    expect(preset.options.mode).toBe('rain');
  });

  it('firework preset should use firework mode', () => {
    const preset = getPreset('firework');
    expect(preset.options.mode).toBe('firework');
  });

  it('hearts preset should use heart shapes', () => {
    const preset = getPreset('hearts');
    expect(preset.options.particle?.shapes).toContain('heart');
  });

  it('stars preset should use star shapes', () => {
    const preset = getPreset('stars');
    expect(preset.options.particle?.shapes).toContain('star');
  });

  it('emoji preset should have image particles', () => {
    const preset = getPreset('emoji');
    expect(preset.options.particle?.images).toBeDefined();
    expect(preset.options.particle?.images?.length).toBeGreaterThan(0);
  });

  it('each preset description should be a non-empty string', () => {
    const names = getPresetNames();
    names.forEach(name => {
      const preset = getPreset(name);
      expect(typeof preset.description).toBe('string');
      expect(preset.description.length).toBeGreaterThan(0);
    });
  });
});

describe('PRESETS object', () => {
  it('should have same keys as getPresetNames', () => {
    const keys = Object.keys(PRESETS);
    const names = getPresetNames();
    expect(keys.sort()).toEqual([...names].sort());
  });
});

describe('COLOR_PALETTES', () => {
  it('should have multiple color palettes', () => {
    expect(Object.keys(COLOR_PALETTES).length).toBeGreaterThan(0);
  });

  it('each palette should have at least 3 colors', () => {
    Object.values(COLOR_PALETTES).forEach(palette => {
      expect(palette.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('each color should be a valid hex string', () => {
    Object.values(COLOR_PALETTES).forEach(palette => {
      palette.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });
});

describe('EMOJI_SETS', () => {
  it('should have multiple emoji sets', () => {
    expect(Object.keys(EMOJI_SETS).length).toBeGreaterThan(0);
  });

  it('each set should have at least 3 emojis', () => {
    Object.values(EMOJI_SETS).forEach(set => {
      expect(set.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('each emoji should be a non-empty string', () => {
    Object.values(EMOJI_SETS).forEach(set => {
      set.forEach(emoji => {
        expect(typeof emoji).toBe('string');
        expect(emoji.length).toBeGreaterThan(0);
      });
    });
  });
});
