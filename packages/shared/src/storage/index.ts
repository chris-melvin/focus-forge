// Storage abstraction for cross-platform support

import { GameState } from '../types/game';

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const STORAGE_KEY = 'focus-forge-save';

export async function loadGameState(storage: StorageAdapter): Promise<GameState | null> {
  try {
    const saved = await storage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as GameState;
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return null;
}

export async function saveGameState(storage: StorageAdapter, state: GameState): Promise<void> {
  try {
    await storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

export async function clearGameState(storage: StorageAdapter): Promise<void> {
  try {
    await storage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear game state:', e);
  }
}

// Web Storage Adapter (localStorage)
export const webStorage: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  },
};

// Mobile storage adapter will be implemented in mobile app using AsyncStorage
