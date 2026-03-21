/**
 * Predefined Shapes and Emoji Sets
 *
 * Large data structures for shapes and emoji that can be tree-shaken
 * when not used by applications.
 *
 * @module shapes-data
 */

import { shapeFromPath, shapesFromEmoji } from './shapes';

/**
 * Common predefined path shapes
 */
export const pathShapes = {
  /** Five-pointed star */
  star: shapeFromPath({
    path: 'M0,-1 L0.588,0.809 L-0.951,-0.309 L0.951,-0.309 L-0.588,0.809 Z',
  }),

  /** Heart shape */
  heart: shapeFromPath({
    path: 'M0,0.8 C-0.5,0.4 -1,-0.2 -1,-0.6 C-1,-1 -0.5,-1.2 0,-0.8 C0.5,-1.2 1,-1 1,-0.6 C1,-0.2 0.5,0.4 0,0.8 Z',
  }),

  /** Diamond shape */
  diamond: shapeFromPath({
    path: 'M0,-1 L0.7,0 L0,1 L-0.7,0 Z',
  }),

  /** Hexagon shape */
  hexagon: shapeFromPath({
    path: 'M0.866,-0.5 L0.866,0.5 L0,1 L-0.866,0.5 L-0.866,-0.5 L0,-1 Z',
  }),

  /** Triangle shape */
  triangle: shapeFromPath({
    path: 'M0,-1 L0.866,0.5 L-0.866,0.5 Z',
  }),

  /** Plus/cross shape */
  plus: shapeFromPath({
    path: 'M-0.25,-1 L0.25,-1 L0.25,-0.25 L1,-0.25 L1,0.25 L0.25,0.25 L0.25,1 L-0.25,1 L-0.25,0.25 L-1,0.25 L-1,-0.25 L-0.25,-0.25 Z',
  }),

  /** Moon/crescent shape */
  moon: shapeFromPath({
    path: 'M0,-1 A1,1 0 1,1 0,1 A0.6,0.6 0 1,0 0,-1 Z',
  }),

  /** Lightning bolt */
  lightning: shapeFromPath({
    path: 'M0.4,-1 L-0.2,0 L0.2,0 L-0.4,1 L0,0.2 L-0.3,0.2 L0.4,-1 Z',
  }),

  /** Spiral shape */
  spiral: shapeFromPath({
    path: 'M0,0 Q0.3,-0.3 0,-0.5 Q-0.5,-0.5 -0.5,0 Q-0.5,0.7 0,0.7 Q0.7,0.7 0.7,0 Q0.7,-0.9 0,-0.9',
  }),

  /** Ribbon/wave shape */
  ribbon: shapeFromPath({
    path: 'M-1,0 Q-0.5,-0.5 0,0 Q0.5,0.5 1,0 Q0.5,-0.3 0,0 Q-0.5,0.3 -1,0 Z',
  }),
};

/**
 * Common emoji sets for quick use
 */
export const emojiShapes = {
  /** Party/celebration emoji */
  party: shapesFromEmoji(['🎉', '🎊', '🥳', '✨', '🎈']),

  /** Heart emoji */
  hearts: shapesFromEmoji(['❤️', '💕', '💖', '💗', '💝']),

  /** Star emoji */
  stars: shapesFromEmoji(['⭐', '🌟', '✨', '💫', '🌠']),

  /** Nature emoji */
  nature: shapesFromEmoji(['🌸', '🌺', '🌻', '🌼', '🌷']),

  /** Food emoji */
  food: shapesFromEmoji(['🍕', '🍔', '🍟', '🍩', '🧁']),

  /** Sports emoji */
  sports: shapesFromEmoji(['⚽', '🏀', '🏈', '⚾', '🎾']),

  /** Weather emoji */
  weather: shapesFromEmoji(['☀️', '⛅', '🌈', '❄️', '💨']),

  /** Money emoji */
  money: shapesFromEmoji(['💰', '💵', '💎', '🪙', '💳']),

  /** Animals emoji */
  animals: shapesFromEmoji(['🦋', '🐝', '🐞', '🦄', '🐱']),

  /** Holiday emoji */
  holiday: shapesFromEmoji(['🎄', '🎃', '🎅', '🐰', '🦃']),
};