/**
 * Feature flags for react-confetti-burst
 *
 * Controls which features are enabled for export.
 * Toggle these when releasing new versions.
 *
 * v1.0.0 - Basic Usage (ConfettiButton, useConfetti, basic confetti())
 * v1.1.0 - React Hooks (useConfettiTrigger, useConfettiSequence, useConfettiCenter)
 * v1.2.0 - Built-in Presets (16 presets)
 * v1.3.0 - canvas-confetti API (confetti.create, confetti.reset)
 * v1.4.0 - Custom Shapes (shapeFromPath, shapeFromText, shapesFromEmoji)
 * v1.5.0 - Advanced Effects (trails, glow, fireworks, continuous mode)
 * v1.6.0 - Full Feature Set (particle utilities)
 */

export const FEATURES = {
  /** v1.0.0 - Basic components, hooks, and engine */
  BASIC: true,
  /** v1.1.0 - Additional React hooks */
  HOOKS: false,
  /** v1.2.0 - Preset configurations */
  PRESETS: true,
  /** v1.3.0 - canvas-confetti compatible API */
  CANVAS_CONFETTI_API: false,
  /** v1.4.0 - Custom shape creation */
  CUSTOM_SHAPES: true,
  /** v1.5.0 - Trail, glow, firework, continuous effects */
  ADVANCED_EFFECTS: false,
  /** v1.6.0 - Full particle utility exports */
  PARTICLE_UTILITIES: false,
} as const;
