/**
 * Tests for React components
 */

import { render, screen, fireEvent } from '@testing-library/react';
import {
  ConfettiBurst,
  ConfettiButton,
  ConfettiOnMount,
} from '../src/components';

// Mock the hooks
const mockFire = jest.fn(() => ({
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  addParticles: jest.fn(),
  clear: jest.fn(),
  getParticleCount: jest.fn(() => 0),
  getState: jest.fn(() => 'stopped' as const),
  promise: Promise.resolve(),
}));

const mockFireFromElement = jest.fn(() => ({
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  addParticles: jest.fn(),
  clear: jest.fn(),
  getParticleCount: jest.fn(() => 0),
  getState: jest.fn(() => 'stopped' as const),
  promise: Promise.resolve(),
}));

jest.mock('../src/hooks', () => ({
  useConfetti: () => ({
    fire: mockFire,
    fireFromElement: mockFireFromElement,
    isActive: false,
    stopAll: jest.fn(),
    pauseAll: jest.fn(),
    resumeAll: jest.fn(),
    getActiveHandles: jest.fn(() => []),
  }),
  useConfettiTrigger: () => ({
    ref: { current: null },
    fire: mockFire,
    isActive: false,
  }),
}));

describe('ConfettiBurst', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fire when active is false', () => {
    render(
      <ConfettiBurst
        active={false}
        origin={{ x: 100, y: 100 }}
      />
    );

    expect(mockFire).not.toHaveBeenCalled();
  });

  it('should fire when active becomes true', () => {
    const { rerender } = render(
      <ConfettiBurst
        active={false}
        origin={{ x: 100, y: 100 }}
      />
    );

    rerender(
      <ConfettiBurst
        active={true}
        origin={{ x: 100, y: 100 }}
      />
    );

    expect(mockFire).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      undefined
    );
  });

  it('should pass options to fire', () => {
    render(
      <ConfettiBurst
        active={true}
        origin={{ x: 50, y: 50 }}
        options={{ particleCount: 100 }}
      />
    );

    expect(mockFire).toHaveBeenCalledWith(
      { x: 50, y: 50 },
      { particleCount: 100 }
    );
  });

  it('should only fire once per activation', () => {
    const { rerender } = render(
      <ConfettiBurst
        active={true}
        origin={{ x: 100, y: 100 }}
      />
    );

    rerender(
      <ConfettiBurst
        active={true}
        origin={{ x: 100, y: 100 }}
      />
    );

    expect(mockFire).toHaveBeenCalledTimes(1);
  });

  it('should fire again after deactivating and reactivating', () => {
    const { rerender } = render(
      <ConfettiBurst
        active={true}
        origin={{ x: 100, y: 100 }}
      />
    );

    rerender(
      <ConfettiBurst
        active={false}
        origin={{ x: 100, y: 100 }}
      />
    );

    rerender(
      <ConfettiBurst
        active={true}
        origin={{ x: 100, y: 100 }}
      />
    );

    expect(mockFire).toHaveBeenCalledTimes(2);
  });

  it('should render null (no DOM output)', () => {
    const { container } = render(
      <ConfettiBurst
        active={false}
        origin={{ x: 100, y: 100 }}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('ConfettiButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a button with children', () => {
    render(
      <ConfettiButton>Click me</ConfettiButton>
    );

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('Click me');
  });

  it('should fire confetti on click by default', () => {
    render(
      <ConfettiButton>Click me</ConfettiButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(mockFireFromElement).toHaveBeenCalled();
  });

  it('should not fire confetti when fireOnClick is false', () => {
    render(
      <ConfettiButton fireOnClick={false}>Click me</ConfettiButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(mockFireFromElement).not.toHaveBeenCalled();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(
      <ConfettiButton onClick={handleClick}>Click me</ConfettiButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalled();
  });

  it('should pass confettiOptions to fireFromElement', () => {
    const options = { particleCount: 50 };
    render(
      <ConfettiButton confettiOptions={options}>Click me</ConfettiButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(mockFireFromElement).toHaveBeenCalledWith(
      expect.any(HTMLButtonElement),
      options
    );
  });

  it('should pass through button props', () => {
    render(
      <ConfettiButton disabled className="my-button" data-testid="test-btn">
        Click me
      </ConfettiButton>
    );

    const button = screen.getByTestId('test-btn') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.className).toContain('my-button');
  });
});

describe('ConfettiOnMount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fire confetti on mount', () => {
    render(
      <ConfettiOnMount origin={{ x: 100, y: 100 }} />
    );

    jest.runAllTimers();

    expect(mockFire).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      undefined
    );
  });

  it('should use viewport center when no origin provided', () => {
    render(<ConfettiOnMount />);

    jest.runAllTimers();

    expect(mockFire).toHaveBeenCalledWith(
      { x: 512, y: 384 },
      undefined
    );
  });

  it('should respect delay option', () => {
    render(
      <ConfettiOnMount origin={{ x: 100, y: 100 }} delay={1000} />
    );

    expect(mockFire).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockFire).toHaveBeenCalled();
  });

  it('should pass options to fire', () => {
    const options = { particleCount: 75 };
    render(
      <ConfettiOnMount origin={{ x: 100, y: 100 }} options={options} />
    );

    jest.runAllTimers();

    expect(mockFire).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      options
    );
  });

  it('should only fire once', () => {
    const { rerender } = render(
      <ConfettiOnMount origin={{ x: 100, y: 100 }} />
    );

    jest.runAllTimers();

    rerender(<ConfettiOnMount origin={{ x: 100, y: 100 }} />);

    jest.runAllTimers();

    expect(mockFire).toHaveBeenCalledTimes(1);
  });

  it('should render null', () => {
    const { container } = render(
      <ConfettiOnMount origin={{ x: 100, y: 100 }} />
    );

    expect(container.firstChild).toBeNull();
  });
});
