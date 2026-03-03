// Main exports for @focus-forge/shared

// Types
export * from './types/game';

// Logic
export {
  gameReducer,
  initialState,
  calculateXpForLevel,
  generateLoot,
  calculateQuitPenalty,
  calculateSessionXp,
  getTotalBonus,
} from './logic/gameReducer';
export type { GameAction } from './logic/gameReducer';

// Storage
export {
  loadGameState,
  saveGameState,
  clearGameState,
  webStorage,
  type StorageAdapter,
} from './storage';
