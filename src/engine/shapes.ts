/**
 * Shape Drawers
 * 
 * Strategy Pattern for rendering different particle shapes
 * Open/Closed Principle - add new shapes without modifying existing code
 * 
 * @module engine/shapes
 */

import type { IShapeDrawer, IParticle } from './interfaces';

const DOUBLE_PI = Math.PI * 2;

/**
 * Circle shape drawer
 */
export class CircleDrawer implements IShapeDrawer {
  readonly type = 'circle';

  draw(ctx: CanvasRenderingContext2D, particle: IParticle, radius: number): void {
    // Dynamic wobble scale for breathing effect
    const wobbleScale = particle.flat 
      ? 1 
      : 0.6 + Math.sin(particle.wobble.angle) * 0.4;
    
    ctx.ellipse(
      0, 0,
      radius * wobbleScale,
      radius * (1 - wobbleScale * 0.3),
      particle.tilt?.value ?? 0,
      0, DOUBLE_PI
    );
  }
}

/**
 * Square/Rectangle shape drawer (classic confetti)
 */
export class SquareDrawer implements IShapeDrawer {
  readonly type = 'square';

  draw(ctx: CanvasRenderingContext2D, _particle: IParticle, radius: number): void {
    // Create dynamic quadrilateral for tumbling effect
    const wobbleOffset = _particle.flat 
      ? 0 
      : Math.sin(_particle.wobble.angle) * radius * 0.3;
    
    ctx.moveTo(-radius + wobbleOffset, -radius);
    ctx.lineTo(radius + wobbleOffset, -radius * 0.5);
    ctx.lineTo(radius - wobbleOffset, radius);
    ctx.lineTo(-radius - wobbleOffset, radius * 0.5);
  }
}

/**
 * Rectangle shape drawer (longer confetti pieces)
 */
export class RectangleDrawer implements IShapeDrawer {
  readonly type = 'rectangle';

  draw(ctx: CanvasRenderingContext2D, particle: IParticle, radius: number): void {
    const width = radius * 1.5;
    const height = radius * 0.6;
    const wobbleOffset = particle.flat 
      ? 0 
      : Math.sin(particle.wobble.angle) * height * 0.2;
    
    ctx.moveTo(-width + wobbleOffset, -height);
    ctx.lineTo(width + wobbleOffset, -height * 0.5);
    ctx.lineTo(width - wobbleOffset, height);
    ctx.lineTo(-width - wobbleOffset, height * 0.5);
  }
}

/**
 * Star shape drawer (5-pointed star)
 */
export class StarDrawer implements IShapeDrawer {
  readonly type = 'star';

  draw(ctx: CanvasRenderingContext2D, _particle: IParticle, radius: number): void {
    const outerRadius = radius;
    const innerRadius = radius * 0.5;
    const spikes = 5;
    const step = Math.PI / spikes;
    let rotation = -Math.PI / 2;

    ctx.moveTo(0, -outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      // Outer point
      ctx.lineTo(
        Math.cos(rotation) * outerRadius,
        Math.sin(rotation) * outerRadius
      );
      rotation += step;
      
      // Inner point
      ctx.lineTo(
        Math.cos(rotation) * innerRadius,
        Math.sin(rotation) * innerRadius
      );
      rotation += step;
    }
  }
}

/**
 * Triangle shape drawer
 */
export class TriangleDrawer implements IShapeDrawer {
  readonly type = 'triangle';

  draw(ctx: CanvasRenderingContext2D, _particle: IParticle, radius: number): void {
    const height = radius * Math.sqrt(3) / 2;
    
    ctx.moveTo(0, -height);
    ctx.lineTo(-radius, height);
    ctx.lineTo(radius, height);
  }
}

/**
 * Diamond shape drawer
 */
export class DiamondDrawer implements IShapeDrawer {
  readonly type = 'diamond';

  draw(ctx: CanvasRenderingContext2D, _particle: IParticle, radius: number): void {
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * 0.6, 0);
    ctx.lineTo(0, radius);
    ctx.lineTo(-radius * 0.6, 0);
  }
}

/**
 * Heart shape drawer
 */
export class HeartDrawer implements IShapeDrawer {
  readonly type = 'heart';

  draw(ctx: CanvasRenderingContext2D, _particle: IParticle, radius: number): void {
    const x = 0;
    const y = -radius * 0.3;
    const topCurveHeight = radius * 0.3;
    
    ctx.moveTo(x, y + topCurveHeight);
    
    // Left curve
    ctx.bezierCurveTo(
      x - radius, y,
      x - radius, y - topCurveHeight * 2,
      x, y - topCurveHeight
    );
    
    // Right curve
    ctx.bezierCurveTo(
      x + radius, y - topCurveHeight * 2,
      x + radius, y,
      x, y + topCurveHeight
    );
  }
}

/**
 * Hexagon shape drawer
 */
export class HexagonDrawer implements IShapeDrawer {
  readonly type = 'hexagon';

  draw(ctx: CanvasRenderingContext2D, _particle: IParticle, radius: number): void {
    const sides = 6;
    const angleStep = DOUBLE_PI / sides;
    
    for (let i = 0; i < sides; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  }
}

/**
 * Shape drawer registry
 * Follows Registry Pattern for extensibility
 */
export class ShapeRegistry {
  private readonly drawers = new Map<string, IShapeDrawer>();

  constructor() {
    // Register default shapes
    this.register(new CircleDrawer());
    this.register(new SquareDrawer());
    this.register(new RectangleDrawer());
    this.register(new StarDrawer());
    this.register(new TriangleDrawer());
    this.register(new DiamondDrawer());
    this.register(new HeartDrawer());
    this.register(new HexagonDrawer());
  }

  /**
   * Register a new shape drawer
   */
  register(drawer: IShapeDrawer): void {
    this.drawers.set(drawer.type, drawer);
  }

  /**
   * Get shape drawer by type
   */
  get(type: string): IShapeDrawer | undefined {
    return this.drawers.get(type);
  }

  /**
   * Check if shape type is registered
   */
  has(type: string): boolean {
    return this.drawers.has(type);
  }

  /**
   * Get all registered shape types
   */
  getTypes(): string[] {
    return Array.from(this.drawers.keys());
  }

  /**
   * Remove a shape drawer
   */
  unregister(type: string): boolean {
    return this.drawers.delete(type);
  }

  /**
   * Clear all registered drawers
   */
  clear(): void {
    this.drawers.clear();
  }
}

/**
 * Default shape registry singleton
 */
export const defaultShapeRegistry = new ShapeRegistry();
