/**
 * Confetti Engine
 * 
 * Main entry point for the confetti system
 * Implements Singleton Pattern for global instance
 * Implements Facade Pattern for simplified API
 * 
 * @module engine/Engine
 */

import type {
  IEngine,
  IContainer,
  IContainerOptions,
  IParticleUpdater,
  IParticleMover,
  IShapeDrawer,
} from './interfaces';
import { Container } from './Container';
import { defaultShapeRegistry } from './shapes';

/**
 * Confetti Engine - manages containers and global configuration
 */
export class Engine implements IEngine {
  private readonly _updaters: IParticleUpdater[] = [];
  private readonly _movers: IParticleMover[] = [];
  private readonly _containers: Container[] = [];
  private _defaultContainer: Container | null = null;

  /**
   * Add a particle updater
   */
  addUpdater(updater: IParticleUpdater): void {
    // Check for duplicate
    if (this._updaters.some(u => u.id === updater.id)) {
      console.warn(`Updater "${updater.id}" already registered`);
      return;
    }
    this._updaters.push(updater);
  }

  /**
   * Add a particle mover
   */
  addMover(mover: IParticleMover): void {
    if (this._movers.some(m => m.id === mover.id)) {
      console.warn(`Mover "${mover.id}" already registered`);
      return;
    }
    this._movers.push(mover);
  }

  /**
   * Add a shape drawer
   */
  addShapeDrawer(drawer: IShapeDrawer): void {
    defaultShapeRegistry.register(drawer);
  }

  /**
   * Get all registered updaters
   */
  getUpdaters(): readonly IParticleUpdater[] {
    return Object.freeze([...this._updaters]);
  }

  /**
   * Get all registered movers
   */
  getMovers(): readonly IParticleMover[] {
    return Object.freeze([...this._movers]);
  }

  /**
   * Get shape drawer by type
   */
  getShapeDrawer(type: string): IShapeDrawer | undefined {
    return defaultShapeRegistry.get(type);
  }

  /**
   * Create a new container
   */
  createContainer(options?: IContainerOptions): IContainer {
    const container = new Container(options);
    this._containers.push(container);
    return container;
  }

  /**
   * Get or create the default container
   */
  getDefaultContainer(): Container {
    if (!this._defaultContainer || this._defaultContainer.destroyed) {
      this._defaultContainer = new Container();
      this._containers.push(this._defaultContainer);
    }
    return this._defaultContainer;
  }

  /**
   * Destroy all containers
   */
  destroyAll(): void {
    for (const container of this._containers) {
      container.destroy();
    }
    this._containers.length = 0;
    this._defaultContainer = null;
  }

  /**
   * Get container count
   */
  get containerCount(): number {
    return this._containers.length;
  }
}

// Singleton instance
let engineInstance: Engine | null = null;

/**
 * Get the singleton engine instance
 */
export function getEngine(): Engine {
  if (!engineInstance) {
    engineInstance = new Engine();
  }
  return engineInstance;
}

/**
 * Reset engine (for testing)
 */
export function resetEngine(): void {
  if (engineInstance) {
    engineInstance.destroyAll();
    engineInstance = null;
  }
}
