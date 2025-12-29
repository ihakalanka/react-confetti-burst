/**
 * Particle Updaters
 * 
 * Strategy Pattern implementation for particle behavior updates
 * Each updater is responsible for a single effect
 * 
 * @module engine/updaters
 */

import type {
  IParticle,
  IParticleUpdater,
  IParticleTransformValues,
  IDelta,
} from './interfaces';

const DOUBLE_PI = Math.PI * 2;

/**
 * Base Updater - handles movement and basic physics
 */
export class BaseUpdater implements IParticleUpdater {
  readonly id = 'base';

  init(_particle: IParticle): void {
    // Base initialization is handled by Particle.create()
  }

  isEnabled(_particle: IParticle): boolean {
    return !_particle.destroyed;
  }

  update(particle: IParticle, delta: IDelta): void {
    if (particle.destroyed) return;

    // Apply movement based on velocity and angle
    const moveX = Math.cos(particle.angle2D) * particle.velocity;
    const moveY = Math.sin(particle.angle2D) * particle.velocity;

    // Update position
    particle.position.x += moveX * delta.factor + particle.drift * delta.factor;
    particle.position.y += moveY * delta.factor + particle.gravity * delta.factor;

    // Apply velocity decay
    particle.velocity *= particle.decay;

    // Update tick counter
    particle.tick++;

    // Calculate opacity based on progress (ease-out fade)
    const progress = particle.tick / particle.totalTicks;
    particle.opacity = 1 - Math.pow(progress, 2);

    // Mark as destroyed when lifetime ends
    if (particle.tick >= particle.totalTicks) {
      particle.destroyed = true;
    }
  }
}

/**
 * Wobble Updater - side-to-side sway effect
 * Like leaves falling or paper fluttering
 */
export class WobbleUpdater implements IParticleUpdater {
  readonly id = 'wobble';

  init(particle: IParticle): void {
    // Wobble is initialized in Particle.create()
    if (!particle.wobble) {
      particle.wobble = {
        angle: Math.random() * DOUBLE_PI,
        angleSpeed: Math.random() * 0.1 + 0.05,
        moveSpeed: -15 + Math.random() * 30,
        distance: 25 + Math.random() * 15,
      };
    }
  }

  isEnabled(particle: IParticle): boolean {
    return !particle.destroyed && !particle.flat && !!particle.wobble;
  }

  update(particle: IParticle, delta: IDelta): void {
    if (!this.isEnabled(particle)) return;

    const wobble = particle.wobble;
    
    // Update wobble angle
    wobble.angle += wobble.angleSpeed * delta.factor;
    
    // Normalize angle
    if (wobble.angle > DOUBLE_PI) {
      wobble.angle -= DOUBLE_PI;
    }

    // Apply wobble offset to position
    const wobbleOffset = Math.cos(wobble.angle) * wobble.distance * 0.1;
    particle.position.x += wobbleOffset * delta.factor;
  }
}

/**
 * Tilt Updater - 3D rotation effect on X/Y axis
 * Creates tumbling appearance
 */
export class TiltUpdater implements IParticleUpdater {
  readonly id = 'tilt';

  init(particle: IParticle): void {
    if (!particle.tilt) {
      particle.tilt = {
        value: Math.random() * DOUBLE_PI,
        sinDirection: Math.random() >= 0.5 ? 1 : -1,
        cosDirection: Math.random() >= 0.5 ? 1 : -1,
        speed: (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        enable: !particle.flat,
      };
    }
  }

  isEnabled(particle: IParticle): boolean {
    return !particle.destroyed && particle.tilt?.enable === true;
  }

  update(particle: IParticle, delta: IDelta): void {
    if (!this.isEnabled(particle)) return;

    const tilt = particle.tilt;
    
    // Update tilt value
    tilt.value += tilt.speed * 0.01 * delta.factor;
    
    // Normalize angle
    if (tilt.value > DOUBLE_PI) {
      tilt.value -= DOUBLE_PI;
    } else if (tilt.value < 0) {
      tilt.value += DOUBLE_PI;
    }
  }

  getTransformValues(particle: IParticle): IParticleTransformValues {
    if (!particle.tilt?.enable) {
      return {};
    }

    const tilt = particle.tilt;
    return {
      b: Math.cos(tilt.value) * tilt.cosDirection * 0.5,
      c: Math.sin(tilt.value) * tilt.sinDirection * 0.5,
    };
  }
}

/**
 * Roll Updater - flip animation showing front/back
 * Creates realistic confetti flip effect with color darkening
 */
export class RollUpdater implements IParticleUpdater {
  readonly id = 'roll';

  init(particle: IParticle): void {
    if (!particle.roll) {
      particle.roll = {
        angle: Math.random() * DOUBLE_PI,
        speed: (15 + Math.random() * 10) / 60,
        horizontal: Math.random() > 0.3,
        vertical: Math.random() > 0.7,
        enable: !particle.flat,
      };
    }
  }

  isEnabled(particle: IParticle): boolean {
    return !particle.destroyed && particle.roll?.enable === true;
  }

  update(particle: IParticle, delta: IDelta): void {
    if (!this.isEnabled(particle)) return;

    const roll = particle.roll;
    
    // Update roll angle
    roll.angle += roll.speed * delta.factor;
    
    // Normalize angle
    if (roll.angle > DOUBLE_PI) {
      roll.angle -= DOUBLE_PI;
    }
  }

  getTransformValues(particle: IParticle): IParticleTransformValues {
    if (!particle.roll?.enable) {
      return {};
    }

    const roll = particle.roll;
    return {
      a: roll.horizontal ? Math.abs(Math.cos(roll.angle)) : undefined,
      d: roll.vertical ? Math.abs(Math.sin(roll.angle)) : undefined,
    };
  }

  /**
   * Get darken amount based on roll angle
   * Simulates back side being darker
   */
  getDarkenAmount(particle: IParticle): number {
    if (!particle.roll?.enable) return 0;

    const roll = particle.roll;
    if (!roll.horizontal && !roll.vertical) return 0;

    const rollValue = roll.horizontal 
      ? Math.cos(roll.angle) 
      : Math.sin(roll.angle);

    // When showing back side, darken by 25
    return rollValue < 0 ? 25 : 0;
  }
}

/**
 * Rotate Updater - 2D spin around z-axis
 */
export class RotateUpdater implements IParticleUpdater {
  readonly id = 'rotate';

  init(particle: IParticle): void {
    if (!particle.rotate) {
      particle.rotate = {
        angle: Math.random() * DOUBLE_PI,
        speed: (Math.random() * 2 - 1) * 0.1,
        enable: !particle.flat,
      };
    }
  }

  isEnabled(particle: IParticle): boolean {
    return !particle.destroyed && particle.rotate?.enable === true;
  }

  update(particle: IParticle, delta: IDelta): void {
    if (!this.isEnabled(particle)) return;

    const rotate = particle.rotate;
    
    // Update rotation angle
    rotate.angle += rotate.speed * delta.factor;
    
    // Normalize angle
    if (rotate.angle > DOUBLE_PI) {
      rotate.angle -= DOUBLE_PI;
    } else if (rotate.angle < 0) {
      rotate.angle += DOUBLE_PI;
    }
  }
}

/**
 * Opacity Updater - handles fade out
 */
export class OpacityUpdater implements IParticleUpdater {
  readonly id = 'opacity';

  init(particle: IParticle): void {
    particle.opacity = 1;
  }

  isEnabled(particle: IParticle): boolean {
    return !particle.destroyed;
  }

  update(particle: IParticle, _delta: IDelta): void {
    if (!this.isEnabled(particle)) return;

    // Ease-out fade based on progress
    const progress = particle.tick / particle.totalTicks;
    particle.opacity = 1 - Math.pow(progress, 2);
  }
}

/**
 * Create default set of updaters
 */
export function createDefaultUpdaters(): IParticleUpdater[] {
  return [
    new BaseUpdater(),
    new WobbleUpdater(),
    new TiltUpdater(),
    new RollUpdater(),
    new RotateUpdater(),
    new OpacityUpdater(),
  ];
}
