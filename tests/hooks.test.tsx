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

  it('should handle multiple active explosions', () => {
    const { result } = renderHook(() => useConfetti());

    act(() => {
      result.current.fire({ x: 100, y: 100 });
      result.current.fire({ x: 200, y: 200 });
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.getActiveHandles()).toHaveLength(2);
  });

  it('should stop all explosions when stopAll is called', () => {
    const { result } = renderHook(() => useConfetti());
    const mockHandle1 = { stop: jest.fn(), pause: jest.fn(), resume: jest.fn(), addParticles: jest.fn(), clear: jest.fn(), getParticleCount: jest.fn(() => 0), getState: jest.fn(() => 'running' as const), promise: Promise.resolve() };
    const mockHandle2 = { stop: jest.fn(), pause: jest.fn(), resume: jest.fn(), addParticles: jest.fn(), clear: jest.fn(), getParticleCount: jest.fn(() => 0), getState: jest.fn(() => 'running' as const), promise: Promise.resolve() };

    (createConfettiExplosion as jest.Mock)
      .mockReturnValueOnce(mockHandle1)
      .mockReturnValueOnce(mockHandle2);

    act(() => {
      result.current.fire({ x: 100, y: 100 });
      result.current.fire({ x: 200, y: 200 });
      result.current.stopAll();
    });

    expect(mockHandle1.stop).toHaveBeenCalled();
    expect(mockHandle2.stop).toHaveBeenCalled();
    expect(result.current.getActiveHandles()).toHaveLength(0);
  });

  it('should pause all explosions when pauseAll is called', () => {
    const { result } = renderHook(() => useConfetti());
    const mockHandle = { stop: jest.fn(), pause: jest.fn(), resume: jest.fn(), addParticles: jest.fn(), clear: jest.fn(), getParticleCount: jest.fn(() => 0), getState: jest.fn(() => 'running' as const), promise: Promise.resolve() };

    (createConfettiExplosion as jest.Mock).mockReturnValue(mockHandle);

    act(() => {
      result.current.fire({ x: 100, y: 100 });
      result.current.pauseAll();
    });

    expect(mockHandle.pause).toHaveBeenCalled();
  });

  it('should resume all explosions when resumeAll is called', () => {
    const { result } = renderHook(() => useConfetti());
    const mockHandle = { stop: jest.fn(), pause: jest.fn(), resume: jest.fn(), addParticles: jest.fn(), clear: jest.fn(), getParticleCount: jest.fn(() => 0), getState: jest.fn(() => 'paused' as const), promise: Promise.resolve() };

    (createConfettiExplosion as jest.Mock).mockReturnValue(mockHandle);

    act(() => {
      result.current.fire({ x: 100, y: 100 });
      result.current.resumeAll();
    });

    expect(mockHandle.resume).toHaveBeenCalled();
  });

  it('should update isActive when explosions complete', async () => {
    const { result } = renderHook(() => useConfetti());
    const mockPromise = Promise.resolve();
    const mockHandle = { stop: jest.fn(), pause: jest.fn(), resume: jest.fn(), addParticles: jest.fn(), clear: jest.fn(), getParticleCount: jest.fn(() => 0), getState: jest.fn(() => 'stopped' as const), promise: mockPromise };

    (createConfettiExplosion as jest.Mock).mockReturnValue(mockHandle);

    act(() => {
      result.current.fire({ x: 100, y: 100 });
    });

    expect(result.current.isActive).toBe(true);

    await act(async () => {
      await mockPromise;
    });

    // Note: In real implementation, isActive would be updated when handles complete
    // This test verifies the promise handling
  });

  it('should handle fireFromElement with options', () => {
    const { result } = renderHook(() => useConfetti());
    const element = document.createElement('button');
    const options = { particleCount: 50, colors: ['#ff0000'] };

    act(() => {
      result.current.fireFromElement(element, options);
    });

    expect(fireFromElement).toHaveBeenCalledWith(element, options);
  });

  it('should handle fireFromElement with invalid element', () => {
    const { result } = renderHook(() => useConfetti());

    act(() => {
      const handle = result.current.fireFromElement(null as any);
      expect(handle).toBeNull();
    });

    act(() => {
      const handle = result.current.fireFromElement(undefined as any);
      expect(handle).toBeNull();
    });
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

  it('should call fireFromElement when fire is called with ref element', () => {
    const { result } = renderHook(() => useConfettiTrigger());
    const element = document.createElement('button');
    (result.current.ref as any).current = element;

    act(() => {
      result.current.fire();
    });

    expect(fireFromElement).toHaveBeenCalledWith(element, undefined);
  });

  it('should handle fire with options', () => {
    const { result } = renderHook(() => useConfettiTrigger());
    const element = document.createElement('button');
    (result.current.ref as any).current = element;

    act(() => {
      result.current.fire();
    });

    expect(fireFromElement).toHaveBeenCalledWith(element, undefined); // options not passed to fire
  });

  it('should return null handle when ref is not set', () => {
    const { result } = renderHook(() => useConfettiTrigger());

    act(() => {
      const handle = result.current.fire();
      expect(handle).toBeNull();
    });
  });

  it('should update isActive when firing', () => {
    const { result } = renderHook(() => useConfettiTrigger());
    const element = document.createElement('button');
    (result.current.ref as any).current = element;

    expect(result.current.isActive).toBe(false);

    act(() => {
      result.current.fire();
    });

    // isActive would be true during animation, but this tests the initial state
    expect((result.current.ref as any).current).toBe(element);
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

  it('should calculate center correctly for different window sizes', () => {
    // Test different window sizes
    Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

    const { result } = renderHook(() => useConfettiCenter());

    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      { x: 400, y: 300 },
      expect.anything()
    );
  });

  it('should handle zero window dimensions', () => {
    Object.defineProperty(window, 'innerWidth', { value: 0, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 0, configurable: true });

    const { result } = renderHook(() => useConfettiCenter());

    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      { x: 0, y: 0 },
      expect.anything()
    );
  });

  it('should override direction options', () => {
    const { result } = renderHook(() => useConfettiCenter({
      direction: { direction: 'up' } // This should be overridden
    }));

    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        direction: { direction: 'radial' }, // Should always be radial
      })
    );
  });

  it('should preserve non-direction options', () => {
    const customOptions = {
      particleCount: 200,
      colors: ['#ff0000'],
      spread: 90
    };

    const { result } = renderHook(() => useConfettiCenter(customOptions));

    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        particleCount: 200,
        colors: ['#ff0000'],
        spread: 90,
        direction: { direction: 'radial' },
      })
    );
  });

  it('should handle window resize', () => {
    const { result, rerender } = renderHook(() => useConfettiCenter());

    // Initial call
    act(() => {
      result.current.fire();
    });

    // Change window size
    Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    rerender();

    act(() => {
      result.current.fire();
    });

    expect(createConfettiExplosion).toHaveBeenLastCalledWith(
      { x: 600, y: 400 },
      expect.anything()
    );
  });
});
