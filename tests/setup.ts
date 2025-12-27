/**
 * Test setup file
 */

import '@testing-library/jest-dom';

// Mock requestAnimationFrame
let rafId = 0;
const rafCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  const id = ++rafId;
  rafCallbacks.set(id, callback);
  return id;
});

global.cancelAnimationFrame = jest.fn((id: number) => {
  rafCallbacks.delete(id);
});

// Helper to advance animation frames
export function advanceAnimationFrame(time: number = 16.67): void {
  const callbacks = Array.from(rafCallbacks.entries());
  rafCallbacks.clear();
  callbacks.forEach(([, callback]) => callback(time));
}

// Mock performance.now
let mockTime = 0;
global.performance.now = jest.fn(() => mockTime);

export function advanceTime(ms: number): void {
  mockTime += ms;
}

export function resetTime(): void {
  mockTime = 0;
}

// Mock crypto.getRandomValues
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn((arr: Uint32Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 0xFFFFFFFF);
      }
      return arr;
    }),
  },
});

// Mock canvas context
const mockContext = {
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  scale: jest.fn(),
  setTransform: jest.fn(),
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  arc: jest.fn(),
  closePath: jest.fn(),
  fill: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray([255, 0, 0, 255]),
  })),
  globalAlpha: 1,
  fillStyle: '',
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext) as any;

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 50,
  top: 100,
  left: 100,
  right: 200,
  bottom: 150,
  x: 100,
  y: 100,
  toJSON: () => {},
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  rafId = 0;
  rafCallbacks.clear();
  resetTime();
});
