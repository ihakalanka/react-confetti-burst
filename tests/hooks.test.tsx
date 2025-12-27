/**
 * Tests for React hooks
 */

import { renderHook, act } from '@testing-library/react';
import {
  useConfetti,
  useConfettiTrigger,
  useConfettiCenter,
} from '../src/hooks';

// Mock the confetti engine
jest.mock('../src/confetti-engine', () => ({
  createConfettiExplosion: jest.fn(() => ({
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    promise: Promise.resolve(),
  })),
  fireFromElement: jest.fn((element) => {
    if (!element) return null;
    return {
      stop: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      promise: Promise.resolve(),
    };
  }),
  forceCleanup: jest.fn(),
}));

import { createConfettiExplosion, fireFromElement } from '../src/confetti-engine';

describe('useConfetti', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with isActive false', () => {
    const { result } = renderHook(() => useConfetti());
    expect(result.current.isActive).toBe(false);
  });

  it('should provide fire function', () => {
    const { result } = renderHook(() => useConfetti());
    expect(typeof result.current.fire).toBe('function');
  });

  it('should provide fireFromElement function', () => {
    const { result } = renderHook(() => useConfetti());
    expect(typeof result.current.fireFromElement).toBe('function');
  });

  it('should provide stopAll function', () => {
    const { result } = renderHook(() => useConfetti());
    expect(typeof result.current.stopAll).toBe('function');
  });

  it('should call createConfettiExplosion when fire is called', () => {
    const { result } = renderHook(() => useConfetti());
    
    act(() => {
      result.current.fire({ x: 100, y: 100 });
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      undefined
    );
  });

  it('should pass options to createConfettiExplosion', () => {
    const { result } = renderHook(() => useConfetti());
    const options = { particleCount: 100 };
    
    act(() => {
      result.current.fire({ x: 50, y: 50 }, options);
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      { x: 50, y: 50 },
      options
    );
  });

  it('should return null when fireFromElement is called with null', () => {
    const { result } = renderHook(() => useConfetti());
    
    let handle: ReturnType<typeof result.current.fireFromElement>;
    act(() => {
      handle = result.current.fireFromElement(null);
    });

    expect(handle!).toBeNull();
  });

  it('should call fireFromElement with element', () => {
    const { result } = renderHook(() => useConfetti());
    const element = document.createElement('button');
    
    act(() => {
      result.current.fireFromElement(element);
    });

    expect(fireFromElement).toHaveBeenCalledWith(element, undefined);
  });
});

describe('useConfettiTrigger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide a ref', () => {
    const { result } = renderHook(() => useConfettiTrigger());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('should provide fire function', () => {
    const { result } = renderHook(() => useConfettiTrigger());
    expect(typeof result.current.fire).toBe('function');
  });

  it('should provide isActive state', () => {
    const { result } = renderHook(() => useConfettiTrigger());
    expect(result.current.isActive).toBe(false);
  });
});

describe('useConfettiCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
  });

  it('should fire confetti at viewport center', () => {
    const { result } = renderHook(() => useConfettiCenter());
    
    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      { x: 512, y: 384 },
      expect.objectContaining({
        direction: { direction: 'radial' },
      })
    );
  });

  it('should merge provided options', () => {
    const options = { particleCount: 200 };
    const { result } = renderHook(() => useConfettiCenter(options));
    
    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        particleCount: 200,
        direction: { direction: 'radial' },
      })
    );
  });
});
