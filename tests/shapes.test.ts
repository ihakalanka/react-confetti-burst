/**
 * Tests for shape creation utilities
 */

import {
  shapeFromPath,
  shapeFromText,
  shapesFromEmoji,
} from '../src/shapes';

describe('shapeFromPath', () => {
  it('should create a path shape with required fields', () => {
    const shape = shapeFromPath({
      path: 'M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z',
    });

    expect(shape.type).toBe('path');
    expect(shape.path).toBe('M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z');
    expect(shape.bounds).toBeDefined();
  });

  it('should calculate bounds from path coordinates', () => {
    const shape = shapeFromPath({
      path: 'M0,0 L10,0 L10,10 L0,10 Z',
    });

    expect(shape.bounds).toBeDefined();
    expect(shape.bounds!.minX).toBe(0);
    expect(shape.bounds!.minY).toBe(0);
    expect(shape.bounds!.maxX).toBe(10);
    expect(shape.bounds!.maxY).toBe(10);
  });

  it('should handle negative coordinates', () => {
    const shape = shapeFromPath({
      path: 'M-5,-5 L5,5',
    });

    expect(shape.bounds!.minX).toBe(-5);
    expect(shape.bounds!.minY).toBe(-5);
    expect(shape.bounds!.maxX).toBe(5);
    expect(shape.bounds!.maxY).toBe(5);
  });

  it('should include optional matrix', () => {
    const matrix = [2, 0, 0, 2, 0, 0];
    const shape = shapeFromPath({
      path: 'M0,0 L1,1',
      matrix,
    });

    expect(shape.matrix).toEqual(matrix);
  });

  it('should include optional fillColor and strokeColor', () => {
    const shape = shapeFromPath({
      path: 'M0,0 L1,1',
      fillColor: '#ff0000',
      strokeColor: '#00ff00',
      strokeWidth: 2,
    });

    expect(shape.fillColor).toBe('#ff0000');
    expect(shape.strokeColor).toBe('#00ff00');
    expect(shape.strokeWidth).toBe(2);
  });

  it('should handle empty path string', () => {
    const shape = shapeFromPath({ path: '' });

    expect(shape.type).toBe('path');
    expect(shape.path).toBe('');
    // Should return default bounds for unparseable path
    expect(shape.bounds).toBeDefined();
  });

  it('should handle path with no numbers', () => {
    const shape = shapeFromPath({ path: 'M Z' });

    expect(shape.bounds).toBeDefined();
    expect(shape.bounds!.minX).toBe(-1); // default fallback
    expect(shape.bounds!.maxX).toBe(1);
  });

  it('should not mutate the input matrix', () => {
    const matrix = [1, 0, 0, 1, 0, 0];
    const originalMatrix = [...matrix];
    shapeFromPath({ path: 'M0,0 L1,1', matrix });

    expect(matrix).toEqual(originalMatrix);
  });
});

describe('shapeFromText', () => {
  it('should create a text shape with required fields', () => {
    const shape = shapeFromText({ text: '🎉' });

    expect(shape.type).toBe('text');
    expect(shape.text).toBe('🎉');
  });

  it('should use default values', () => {
    const shape = shapeFromText({ text: 'A' });

    expect(shape.scalar).toBe(1);
    expect(shape.fontFamily).toBe('serif');
    expect(shape.fontWeight).toBe('normal');
    expect(shape.fontStyle).toBe('normal');
  });

  it('should accept custom scalar', () => {
    const shape = shapeFromText({ text: '🎊', scalar: 2.5 });

    expect(shape.scalar).toBe(2.5);
  });

  it('should accept custom font options', () => {
    const shape = shapeFromText({
      text: 'YAY',
      fontFamily: 'Impact',
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: '#ff0000',
    });

    expect(shape.fontFamily).toBe('Impact');
    expect(shape.fontWeight).toBe('bold');
    expect(shape.fontStyle).toBe('italic');
    expect(shape.color).toBe('#ff0000');
  });

  it('should convert numeric fontWeight to string', () => {
    const shape = shapeFromText({ text: 'A', fontWeight: 700 });

    expect(shape.fontWeight).toBe('700');
  });

  it('should handle empty text', () => {
    const shape = shapeFromText({ text: '' });

    expect(shape.type).toBe('text');
    expect(shape.text).toBe('');
  });

  it('should handle multi-character emoji', () => {
    const shape = shapeFromText({ text: '👨‍👩‍👧‍👦' });

    expect(shape.text).toBe('👨‍👩‍👧‍👦');
  });
});

describe('shapesFromEmoji', () => {
  it('should create shapes from an array of emojis', () => {
    const shapes = shapesFromEmoji(['🎉', '🎊', '✨']);

    expect(shapes).toHaveLength(3);
    expect(shapes[0].text).toBe('🎉');
    expect(shapes[1].text).toBe('🎊');
    expect(shapes[2].text).toBe('✨');
  });

  it('should apply common options to all shapes', () => {
    const shapes = shapesFromEmoji(['🎉', '🎊'], { scalar: 2, fontFamily: 'sans-serif' });

    shapes.forEach(shape => {
      expect(shape.scalar).toBe(2);
      expect(shape.fontFamily).toBe('sans-serif');
    });
  });

  it('should return empty array for empty input', () => {
    const shapes = shapesFromEmoji([]);

    expect(shapes).toHaveLength(0);
  });

  it('should create TextShape objects', () => {
    const shapes = shapesFromEmoji(['❤️']);

    expect(shapes[0].type).toBe('text');
  });

  it('should handle single emoji', () => {
    const shapes = shapesFromEmoji(['🎈']);

    expect(shapes).toHaveLength(1);
    expect(shapes[0].text).toBe('🎈');
  });

  it('should handle large arrays', () => {
    const emojis = Array(100).fill('🎉');
    const shapes = shapesFromEmoji(emojis);

    expect(shapes).toHaveLength(100);
  });
});
