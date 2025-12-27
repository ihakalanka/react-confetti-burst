# react-confetti-burst 🎉

A high-performance, zero-dependency React confetti component with directional bursts, continuous modes, and advanced effects using the native Canvas API. **More features than both react-confetti AND canvas-confetti!**

[![npm version](https://badge.fury.io/js/react-confetti-burst.svg)](https://badge.fury.io/js/react-confetti-burst)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-confetti-burst)](https://bundlephobia.com/package/react-confetti-burst)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why react-confetti-burst?

This package combines the best of **react-confetti** and **canvas-confetti** while adding unique features:

### vs react-confetti

| Feature | react-confetti | react-confetti-burst |
|---------|---------------|---------------------|
| Continuous/Recycle mode | ✅ | ✅ |
| Custom drawShape | ✅ | ✅ |
| Spawn area (confettiSource) | ✅ | ✅ |
| Frame rate control | ❌ | ✅ |
| **Directional bursts** | ❌ | ✅ |
| **16 Built-in presets** | ❌ | ✅ |
| **Emoji particles** | ❌ | ✅ |
| **Image particles** | ❌ | ✅ |
| **Trail effects** | ❌ | ✅ |
| **Glow effects** | ❌ | ✅ |
| **Firework mode** | ❌ | ✅ |
| **Snow mode** | ❌ | ✅ |
| **Rain mode** | ❌ | ✅ |
| **Animation control** | Basic | Full (pause/resume/addParticles) |
| **TypeScript** | @types package | Built-in, strict mode |
| Zero dependencies | ❌ | ✅ |

### vs canvas-confetti

| Feature | canvas-confetti | react-confetti-burst |
|---------|----------------|---------------------|
| shapeFromPath (SVG paths) | ✅ | ✅ |
| shapeFromText (emoji/text) | ✅ | ✅ |
| confetti.reset() | ✅ | ✅ |
| confetti.create(canvas) | ✅ | ✅ |
| disableForReducedMotion | ✅ | ✅ |
| scalar/ticks/flat options | ✅ | ✅ |
| Functional API | ✅ | ✅ |
| **React Components** | ❌ | ✅ |
| **React Hooks** | ❌ | ✅ |
| **16 Built-in presets** | ❌ | ✅ |
| **Trail effects** | ❌ | ✅ |
| **Glow effects** | ❌ | ✅ |
| **Firework mode** | ❌ | ✅ |
| **Snow/Rain modes** | ❌ | ✅ |
| **pauseAll/resumeAll** | ❌ | ✅ |
| **Sequence animations** | ❌ | ✅ |
| TypeScript | @types package | Built-in, strict mode |

## Installation

```bash
npm install react-confetti-burst
# or
yarn add react-confetti-burst
# or
pnpm add react-confetti-burst
```

## Quick Start

### The Simplest Way

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

### Using the Hook

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

### canvas-confetti Compatible API

```tsx
import { confetti } from 'react-confetti-burst';

// Basic burst (same as canvas-confetti!)
confetti();

// With options
confetti({
  particleCount: 100,
  spread: 70,
  origin: { x: 0.5, y: 0.5 }
});

// Stop all confetti
confetti.reset();

// Custom canvas instance
const myCanvas = document.getElementById('my-canvas');
const myConfetti = confetti.create(myCanvas, { resize: true });
myConfetti({ particleCount: 200 });
myConfetti.reset();
```

### Directional Burst from a Button

```tsx
import { useConfettiTrigger } from 'react-confetti-burst';

function SubmitButton() {
  const { ref, fire } = useConfettiTrigger({
    direction: { direction: 'up', spread: 45 },
    particleCount: 30,
  });

  return (
    <button ref={ref} onClick={fire}>
      Submit ✓
    </button>
  );
}
```
```

## API Reference

### Hooks

#### `useConfetti()`

The main hook for programmatic confetti control.

```tsx
const { 
  fire, 
  fireFromElement, 
  isActive, 
  stopAll,
  pauseAll,    // NEW: Pause all animations
  resumeAll,   // NEW: Resume all animations  
  getActiveHandles // NEW: Get all active animation handles
} = useConfetti();

// Fire from a point
fire({ x: 500, y: 300 }, options);

// Fire from an element's center
fireFromElement(buttonElement, options);

// Check if animation is running
console.log(isActive); // boolean

// Stop all active animations
stopAll();
```

#### `useConfettiTrigger<T>(options?)`

Hook that returns a ref and fire function for easy element binding.

```tsx
const { ref, fire, isActive } = useConfettiTrigger<HTMLButtonElement>({
  particleCount: 50,
});

return <button ref={ref} onClick={fire}>Fire!</button>;
```

#### `useConfettiSequence(bursts)`

Hook for creating sequenced multi-burst animations.

```tsx
const { start, isActive, cancel } = useConfettiSequence([
  { origin: { x: 100, y: 500 }, delay: 0 },
  { origin: { x: 300, y: 500 }, delay: 200 },
  { origin: { x: 500, y: 500 }, delay: 400 },
]);
```

#### `useConfettiCenter(options?)`

Hook for viewport-centered radial bursts.

```tsx
const { fire, isActive } = useConfettiCenter({ particleCount: 100 });
```

### Components

#### `<Confetti>` (react-confetti compatible)

Drop-in replacement for react-confetti with continuous falling confetti.

```tsx
import { Confetti } from 'react-confetti-burst';

// Basic continuous confetti
<Confetti />

// With all react-confetti compatible props
<Confetti
  width={window.innerWidth}
  height={window.innerHeight}
  numberOfPieces={200}
  recycle={true}
  run={true}
  gravity={0.3}
  wind={0}
  colors={['#f00', '#0f0', '#00f']}
  drawShape={ctx => {
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  }}
/>
```

#### `<ConfettiButton>`

A button that automatically fires confetti on click.

```tsx
<ConfettiButton
  confettiOptions={{ particleCount: 30 }}
  fireOnClick={true}
  onClick={() => console.log('Clicked!')}
>
  Click me!
</ConfettiButton>
```

#### `<ConfettiBurst>`

Declarative component for conditional confetti.

```tsx
<ConfettiBurst
  active={showConfetti}
  origin={{ x: 500, y: 300 }}
  options={{ particleCount: 50 }}
  onComplete={() => setShowConfetti(false)}
/>
```

#### `<ConfettiCannon>`

Positioned cannon for directional bursts.

```tsx
<ConfettiCannon
  left="10%"
  top="90%"
  angle={60}
  fire={shouldFire}
  options={{ particleCount: 40 }}
/>
```

#### `<ConfettiOnMount>`

Fire confetti when component mounts.

```tsx
<ConfettiOnMount
  delay={500}
  options={{ direction: { direction: 'radial' } }}
/>
```

### Configuration Options

```typescript
interface ConfettiBurstOptions {
  // Number of particles (default: 50)
  particleCount?: number;
  
  // Direction configuration
  direction?: {
    // Preset direction or 'custom'
    direction?: 'up' | 'down' | 'left' | 'right' | 'radial' | 'custom';
    // Custom angle in degrees (0 = right, 90 = up)
    angle?: number;
    // Spread angle in degrees (default: 45)
    spread?: number;
    // Velocity range [min, max] (default: [20, 40])
    velocity?: [number, number];
  };
  
  // Particle configuration
  particle?: {
    // Array of colors (hex, rgb, or named)
    colors?: string[];
    // Shapes to use (default: ['square', 'circle'])
    shapes?: ('square' | 'circle' | 'rectangle' | 'triangle' | 'star' | 'line' | 'heart' | 'diamond' | 'hexagon')[];
    // Size range [min, max] in pixels (default: [8, 12])
    size?: [number, number];
    // Opacity range [min, max] (default: [0.8, 1])
    opacity?: [number, number];
    // Lifespan in milliseconds (default: 3000)
    lifespan?: number;
    // Whether to fade out (default: true)
    fadeOut?: boolean;
    // Whether to scale down (default: true)
    scaleDown?: boolean;
    // Custom draw function
    drawShape?: (ctx: CanvasRenderingContext2D) => void;
    // Trail effect
    trail?: { enabled: boolean; length: number; fade: number };
    // Glow effect  
    glow?: { enabled: boolean; blur: number; intensity: number };
    // Emoji particles
    images?: { src: string; isEmoji?: boolean }[];
  };
  
  // Physics configuration
  physics?: {
    // Gravity strength (default: 0.3)
    gravity?: number;
    // Air resistance (default: 0.02)
    drag?: number;
    // Rotation speed multiplier (default: 1)
    rotationSpeed?: number;
    // Horizontal wind force (default: 0)
    wind?: number;
    // Whether particles tumble (default: true)
    tumble?: boolean;
    // Velocity decay per frame (default: 0.98)
    decay?: number;
  };
  
  // Effect mode (default: 'burst')
  mode?: 'burst' | 'continuous' | 'firework' | 'snow' | 'rain';
  
  // Canvas z-index (default: 9999)
  zIndex?: number;
  
  // Callbacks
  onStart?: () => void;
  onComplete?: () => void;
}
```

## Built-in Presets

Use presets for instant effects:

```tsx
import { getPreset, PRESETS } from 'react-confetti-burst';

// Get a preset configuration
const { fire } = useConfetti();
fire(origin, getPreset('celebration'));

// Available presets:
// - default, celebration, firework, snow, rain
// - sparkle, confetti, emoji, hearts, stars  
// - money, pride, christmas, halloween
// - newYear, birthday
```

## Examples

### Continuous Mode (like react-confetti)

```tsx
// Method 1: Use the Confetti component
<Confetti 
  numberOfPieces={200} 
  recycle={true} 
  run={isRunning} 
/>

// Method 2: Use the hook with mode option
const { fire } = useConfetti();
fire({ x: 0, y: 0 }, {
  mode: 'continuous',
  continuous: {
    recycle: true,
    numberOfPieces: 200,
    spawnRate: 30,
    run: true,
  }
});
```

### Firework Mode

```tsx
fire(origin, {
  mode: 'firework',
  firework: {
    secondaryExplosions: true,
    burstCount: 80,
    launchHeight: 0.6,
  }
});
```

### Trail and Glow Effects

```tsx
fire(origin, {
  particle: {
    trail: { enabled: true, length: 10, fade: 0.5 },
    glow: { enabled: true, blur: 15, intensity: 0.8 },
  }
});
```

### Emoji Confetti

```tsx
import { EMOJI_SETS } from 'react-confetti-burst';

fire(origin, {
  particle: {
    images: EMOJI_SETS.celebration.map(emoji => ({ src: emoji, isEmoji: true })),
  }
});

// Available emoji sets: celebration, hearts, stars, money, christmas, halloween, birthday, food
```

### Custom Draw Function

```tsx
fire(origin, {
  particle: {
    drawShape: (ctx) => {
      // Draw a custom heart
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.bezierCurveTo(5, -10, 10, 0, 0, 10);
      ctx.bezierCurveTo(-10, 0, -5, -10, 0, -5);
      ctx.fill();
    }
  }
});
```

### Directional Burst from Button Corners

```tsx
function CardWithCornerBursts() {
  const { fire } = useConfetti();
  const cardRef = useRef<HTMLDivElement>(null);

  const fireFromCorner = (corner: 'top-left' | 'top-right') => {
    const rect = cardRef.current!.getBoundingClientRect();
    const isLeft = corner === 'top-left';
    
    fire(
      { x: isLeft ? rect.left : rect.right, y: rect.top },
      {
        direction: { direction: 'custom', angle: isLeft ? 135 : 45 },
        particleCount: 25,
      }
    );
  };

  return (
    <div ref={cardRef}>
      <button onClick={() => fireFromCorner('top-left')}>↖</button>
      <button onClick={() => fireFromCorner('top-right')}>↗</button>
    </div>
  );
}
```

### Physics Presets

```tsx
const presets = {
  floaty: { gravity: 0.1, decay: 0.995 },
  heavy: { gravity: 0.8, decay: 0.9 },
  windy: { gravity: 0.2, wind: 0.8 },
};

fire(origin, { physics: presets.floaty, particle: { lifespan: 5000 } });
```

### Color Themes

```tsx
const themes = {
  sunset: ['#FF6B6B', '#FFA07A', '#FFD700', '#FF8C00'],
  ocean: ['#0077B6', '#00B4D8', '#90E0EF', '#48CAE4'],
  forest: ['#2D5A27', '#4A7C23', '#6B8E23', '#98FB98'],
};

fire(origin, { particle: { colors: themes.ocean } });
```

### Animation Control

```tsx
const { fire, stopAll, pauseAll, resumeAll } = useConfetti();
const handleRef = useRef<ExplosionHandle>();

// Start animation and save handle
handleRef.current = fire(origin, { particle: { lifespan: 10000 } });

// Pause a single animation
handleRef.current.pause();

// Resume a single animation
handleRef.current.resume();

// Stop a single animation immediately
handleRef.current.stop();

// Or control ALL animations at once
pauseAll();   // Pause all
resumeAll();  // Resume all
stopAll();    // Stop all
```

## canvas-confetti Compatible API

Use the functional API just like canvas-confetti:

```tsx
import { confetti, shapeFromPath, shapeFromText, shapesFromEmoji } from 'react-confetti-burst';

// Basic burst
confetti();

// Customized
confetti({
  particleCount: 100,
  spread: 70,
  origin: { x: 0.5, y: 0.5 }, // 0-1 normalized coordinates
  startVelocity: 45,
  decay: 0.9,
  gravity: 1,
  drift: 0,
  ticks: 200,
  scalar: 1,
  flat: false, // Set true for 2D mode (no tilt/wobble)
  disableForReducedMotion: true, // Accessibility support!
});

// Custom SVG path shapes
const star = shapeFromPath({
  path: 'M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z'
});

// Text/emoji shapes
const heart = shapeFromText({ text: '❤️', scalar: 2 });
const party = shapeFromText({ text: '🎉' });

// Batch emoji shapes
const emojiShapes = shapesFromEmoji(['🎉', '🎊', '✨', '🥳']);

// Use custom shapes
confetti({
  shapes: [star, heart, party, 'circle', 'square'],
  particleCount: 50
});

// Fire from both sides (celebration pattern)
confetti.fireworks();

// School pride pattern
confetti.schoolPride({ colors: ['#ff0000', '#ffffff'] });

// Falling snow effect
confetti.snow({ duration: 5000 });

// Burst from a point
confetti.burst({ x: 0.5, y: 0.3 });

// Custom canvas instance
const myCanvas = document.getElementById('my-canvas');
const myConfetti = confetti.create(myCanvas, { 
  resize: true,
  disableForReducedMotion: true 
});

// Use the custom instance
myConfetti({ particleCount: 100 });

// Reset/clear
myConfetti.reset();

// Also works with default canvas
confetti.reset();
```

### Pre-built Path Shapes

```tsx
import { pathShapes, emojiShapes } from 'react-confetti-burst';

// Use pre-built SVG path shapes
confetti({ shapes: [pathShapes.star, pathShapes.heart, pathShapes.diamond] });

// Available pathShapes: star, heart, diamond, hexagon, triangle, plus, moon, lightning, spiral, ribbon

// Use pre-built emoji shape sets
confetti({ shapes: emojiShapes.party });

// Available emojiShapes: party, hearts, stars, nature, food, sports, weather, money, animals, holiday
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  ConfettiBurstOptions,
  BurstOrigin,
  ExplosionHandle,
  ParticleShape,
  BurstDirection,
  PhysicsConfig,
  ParticleConfig,
  DirectionConfig,
  EffectMode,
  TrailConfig,
  GlowConfig,
  ContinuousConfig,
  FireworkConfig,
  PresetName,
  // canvas-confetti compatible types
  NormalizedOrigin,
  PathShape,
  TextShape,
  CustomShape,
  ShapeInput,
  AccessibilityConfig,
  CanvasConfettiOptions,
  ConfettiCreateOptions,
} from 'react-confetti-burst';
```

## Migrating from react-confetti

Simply replace your import and use the `<Confetti>` component:

```tsx
// Before (react-confetti)
import Confetti from 'react-confetti';

// After (react-confetti-burst)
import { Confetti } from 'react-confetti-burst';

// Same usage - it's a drop-in replacement!
<Confetti width={width} height={height} numberOfPieces={200} recycle={true} />
```

## Migrating from canvas-confetti

Replace your import and use the same API:

```tsx
// Before (canvas-confetti)
import confetti from 'canvas-confetti';

// After (react-confetti-burst)
import { confetti } from 'react-confetti-burst';

// Same API works!
confetti({ particleCount: 100, spread: 70 });
confetti.reset();
```

## Performance

- **Single Canvas:** All particles render on one canvas element
- **RequestAnimationFrame:** Smooth 60fps animations synced with display refresh
- **Frame Rate Control:** Optional FPS limiting for battery savings
- **Automatic Cleanup:** Canvas is removed from DOM when not in use
- **Particle Limits:** Built-in safeguards prevent performance degradation
- **DPR Aware:** Renders crisp on high-DPI displays without performance hit

## Accessibility

The package includes accessibility features:

```tsx
// Respect user's reduced motion preference
confetti({ disableForReducedMotion: true });

// Or configure in options
fire(origin, {
  accessibility: {
    disableForReducedMotion: true,
    ariaLabel: 'Celebration confetti',
    ariaHidden: true,
  }
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT © 2025

---

Made with 🎉 for the React community
