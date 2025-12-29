# react-confetti-burst 🎉

A high-performance, zero-dependency React confetti component with realistic particle physics using the native Canvas API.

[![npm version](https://badge.fury.io/js/react-confetti-burst.svg)](https://badge.fury.io/js/react-confetti-burst)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-confetti-burst)](https://bundlephobia.com/package/react-confetti-burst)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🎮 **[Live Playground](https://ihakalanka.github.io/confetti-burst-playground/)** | 📦 **[GitHub](https://github.com/ihakalanka/react-confetti-burst)**

## Features

- 🚀 **Zero dependencies** - Pure React + Canvas API
- 🎯 **Directional bursts** - Up, down, left, right, radial, or custom angles
- ⚡ **High performance** - Optimized canvas rendering with 60fps
- 🎨 **Realistic physics** - Wobble, tilt, roll, and rotate effects
- 📦 **Tiny bundle** - Minimal footprint
- 🔷 **TypeScript first** - Full type safety built-in
- ♿ **Accessible** - Respects `prefers-reduced-motion`

## Installation

```bash
npm install react-confetti-burst
# or
yarn add react-confetti-burst
# or
pnpm add react-confetti-burst
```

## Quick Start

### The Simplest Way - ConfettiButton

```tsx
import { ConfettiButton } from 'react-confetti-burst';

function App() {
  return (
    <ConfettiButton>
      Click me! 🎉
    </ConfettiButton>
  );
}
```

### Using the Hook - useConfetti

```tsx
import { useConfetti } from 'react-confetti-burst';

function App() {
  const { fire } = useConfetti();

  return (
    <button onClick={(e) => fire({ x: e.clientX, y: e.clientY })}>
      Celebrate!
    </button>
  );
}
```

### Functional API - confetti()

```tsx
import { confetti } from 'react-confetti-burst';

// Basic burst from center
confetti();

// With options
confetti({
  particleCount: 150,
  size: 4,
  spread: 70,
  origin: { x: 0.5, y: 0.5 }
});
```

## confetti() Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `particleCount` | `number` | `100` | Number of confetti particles to launch |
| `size` | `number` | `4` | Base size of particles in pixels |
| `angle` | `number` | `90` | Launch angle in degrees (90 = straight up) |
| `spread` | `number` | `45` | Spread angle in degrees |
| `startVelocity` | `number` | `45` | Initial velocity in pixels per frame |
| `decay` | `number` | `0.94` | Speed decay factor (0-1) |
| `gravity` | `number` | `1` | Gravity strength (1 = full, 0 = none) |
| `drift` | `number` | `0` | Horizontal drift (-1 to 1) |
| `ticks` | `number` | `200` | Animation duration in frames |
| `origin` | `{ x, y }` | `{ x: 0.5, y: 0.5 }` | Origin position (0-1 coordinates) |
| `colors` | `string[]` | Rainbow colors | Array of hex colors |
| `shapes` | `string[]` | `['square', 'circle']` | Particle shapes |
| `scalar` | `number` | `1` | Scale multiplier for particle size |
| `flat` | `boolean` | `false` | Disable 3D effects (2D mode) |
| `zIndex` | `number` | `100` | Canvas z-index |
| `disableForReducedMotion` | `boolean` | `false` | Respect reduced motion preference |

## API Reference

### Components

#### `<ConfettiButton>`

A button that automatically fires confetti on click.

```tsx
import { ConfettiButton } from 'react-confetti-burst';

<ConfettiButton
  confettiOptions={{
    particleCount: 50,
    spread: 60,
    colors: ['#ff6b6b', '#4ecdc4', '#ffe66d'],
  }}
>
  Click me!
</ConfettiButton>
```

**Props:**
- `confettiOptions?: ConfettiBurstOptions` - Configuration for the confetti burst
- `fireOnClick?: boolean` - Whether to fire on click (default: `true`)
- All standard button HTML attributes

#### `<ConfettiBurst>`

Declarative component for conditional confetti.

```tsx
import { ConfettiBurst } from 'react-confetti-burst';

<ConfettiBurst
  active={showConfetti}
  origin={{ x: 500, y: 300 }}
  options={{ particleCount: 50 }}
  onComplete={() => setShowConfetti(false)}
/>
```

### Hooks

#### `useConfetti()`

The main hook for programmatic confetti control.

```tsx
import { useConfetti } from 'react-confetti-burst';

function App() {
  const { fire, fireFromElement, isActive, stopAll } = useConfetti();

  // Fire from a specific point
  const handleClick = (e: React.MouseEvent) => {
    fire({ x: e.clientX, y: e.clientY }, {
      particleCount: 50,
      direction: { direction: 'up', spread: 45 },
    });
  };

  // Fire from an element's center
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleButtonClick = () => {
    fireFromElement(buttonRef.current);
  };

  return (
    <>
      <div onClick={handleClick}>Click anywhere</div>
      <button ref={buttonRef} onClick={handleButtonClick}>
        Fire from me!
      </button>
      {isActive && <p>Animation running...</p>}
      <button onClick={stopAll}>Stop All</button>
    </>
  );
}
```

**Returns:**
- `fire(origin, options?)` - Fire confetti from a point `{ x, y }`
- `fireFromElement(element, options?)` - Fire from an element's center
- `isActive` - Boolean indicating if any animation is running
- `stopAll()` - Stop all active animations

### Functional API

#### `confetti(options?)`

Fire confetti imperatively from anywhere in your code.

```tsx
import { confetti } from 'react-confetti-burst';

// Simple burst
confetti();

// Customized burst
confetti({
  particleCount: 100,
  spread: 70,
  origin: { x: 0.5, y: 0.5 },
  colors: ['#ff0000', '#00ff00', '#0000ff'],
});

// Directional burst
confetti({
  particleCount: 50,
  direction: {
    direction: 'up',
    spread: 45,
    velocity: [20, 40],
  },
});
```

## Configuration Options

### ConfettiBurstOptions (for React components/hooks)

```typescript
interface ConfettiBurstOptions {
  // Number of particles (default: 100)
  particleCount?: number;

  // Base particle size in pixels (default: 4)
  size?: number;

  // Direction configuration
  direction?: {
    direction?: 'up' | 'down' | 'left' | 'right' | 'radial' | 'custom';
    angle?: number;      // For 'custom' direction (degrees)
    spread?: number;     // Spread angle (default: 45)
    velocity?: [number, number]; // Min/max velocity
  };

  // Particle appearance
  particle?: {
    size?: [number, number];     // Min/max size
    colors?: string[];           // Array of colors
    shapes?: ('square' | 'circle' | 'star' | 'triangle')[];
    opacity?: [number, number];  // Min/max opacity
  };

  // Physics
  physics?: {
    gravity?: number;      // Gravity strength (default: 0.5)
    friction?: number;     // Air friction (default: 0.99)
    wind?: number;         // Horizontal wind force
  };

  // Lifecycle callbacks
  onStart?: () => void;
  onComplete?: () => void;
}
```

## Particle Physics

The confetti engine features realistic particle physics with four independent effects:

- **Wobble** - Side-to-side sway like leaves falling
- **Tilt** - 3D rotation creating a tumbling effect
- **Roll** - Flip animation with darkening on the back side
- **Rotate** - 2D spin around the z-axis

Set `flat: true` to disable all 3D effects for a simpler 2D animation.

## Examples

### Directional Bursts

```tsx
import { useConfetti } from 'react-confetti-burst';

function DirectionalExample() {
  const { fire } = useConfetti();

  const fireUp = () => fire({ x: 400, y: 500 }, {
    direction: { direction: 'up', spread: 30 },
  });

  const fireRadial = () => fire({ x: 400, y: 300 }, {
    direction: { direction: 'radial' },
  });

  return (
    <>
      <button onClick={fireUp}>Fire Up ⬆️</button>
      <button onClick={fireRadial}>Radial Burst 💥</button>
    </>
  );
}
```

### Custom Colors

```tsx
<ConfettiButton
  confettiOptions={{
    particle: {
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
    },
  }}
>
  Golden Burst ✨
</ConfettiButton>
```

### Form Submission Success

```tsx
import { confetti } from 'react-confetti-burst';

async function handleSubmit(data: FormData) {
  const response = await submitForm(data);
  
  if (response.success) {
    confetti({
      particleCount: 150,
      size: 5,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
    });
  }
}
```

### Firework Effect

```tsx
import { confetti } from 'react-confetti-burst';

// Built-in fireworks preset
confetti.fireworks();

// Or customize
confetti.fireworks({
  particleCount: 50,
  colors: ['#ff0000', '#ffff00', '#00ff00'],
});
```

### School Pride (Two-sided burst)

```tsx
import { confetti } from 'react-confetti-burst';

confetti.schoolPride({
  colors: ['#bb0000', '#ffffff'], // Your school colors
});
```

### Snow Effect

```tsx
import { confetti } from 'react-confetti-burst';

confetti.snow({
  duration: 5000, // 5 seconds
  colors: ['#ffffff', '#e0e0e0'],
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Support

If you find this package helpful, consider buying me a coffee! ☕

<p><a href="https://www.buymeacoffee.com/akalankaih4"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="akalankaih4" /></a></p><br><br>

## License

MIT © [ihakalanka](https://github.com/ihakalanka)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/ihakalanka/react-confetti-burst/blob/main/CONTRIBUTING.md) before submitting a PR.
