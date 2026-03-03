'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  GameState,
  Item,
  gameReducer,
  initialState,
  generateLoot,
  calculateQuitPenalty,
  calculateSessionXp,
  getTotalBonus,
} from '@focus-forge/shared';

interface GameContextType {
  state: GameState;
  isLoading: boolean;
  startSession: (duration: number, activity: string) => void;
  completeSession: () => { xp: number; loot: Item[] };
  quitSession: (percentCompleted: number) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: string) => void;
  placeDecor: (item: Item, roomId: string) => void;
  removeDecor: (itemId: string, roomId: string) => void;
  useConsumable: (itemId: string) => void;
  getTotalBonus: () => { xpBonus: number; lootBonus: number };
}

const GameContext = createContext<GameContextType | null>(null);

// Local storage fallback for offline mode
const saveToLocalStorage = (state: GameState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('focus-forge-offline', JSON.stringify(state));
  }
};

const loadFromLocalStorage = (): GameState | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('focus-forge-offline');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Load game state from API on mount
  useEffect(() => {
    const loadGameState = async () => {
      if (!isLoaded) return;
      
      if (!userId) {
        // Try to load from localStorage for offline mode
        const offlineState = loadFromLocalStorage();
        if (offlineState) {
          dispatch({ type: 'LOAD_STATE', payload: offlineState });
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/game');
        if (response.ok) {
          const data = await response.json();
          dispatch({ 
            type: 'LOAD_STATE', 
            payload: {
              character: data.character,
              inventory: data.inventory,
              hall: data.hall,
              sessions: data.sessions,
              streak: data.streak,
              lastSessionDate: data.lastSessionDate,
              totalFocusHours: data.totalFocusHours,
            } 
          });
          setIsOnline(true);
        } else {
          // Fall back to localStorage
          const offlineState = loadFromLocalStorage();
          if (offlineState) {
            dispatch({ type: 'LOAD_STATE', payload: offlineState });
          }
          setIsOnline(false);
        }
      } catch (error) {
        console.error('Error loading game state:', error);
        const offlineState = loadFromLocalStorage();
        if (offlineState) {
          dispatch({ type: 'LOAD_STATE', payload: offlineState });
        }
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, [isLoaded, userId]);

  // Save game state to API when it changes
  useEffect(() => {
    const saveGameState = async () => {
      if (!userId || isLoading) return;

      // Always save to localStorage as backup
      saveToLocalStorage(state);

      // Try to save to API
      try {
        await fetch('/api/game', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        });
        setIsOnline(true);
      } catch (error) {
        console.error('Error saving game state:', error);
        setIsOnline(false);
      }
    };

    saveGameState();
  }, [state, userId, isLoading]);

  const startSession = useCallback((duration: number, activity: string) => {
    dispatch({ type: 'START_SESSION', payload: { duration, activity } });
  }, []);

  const completeSession = useCallback(() => {
    const currentSession = state.sessions[state.sessions.length - 1];
    if (!currentSession) return { xp: 0, loot: [] };

    const bonuses = getTotalBonus(state);
    const totalXp = calculateSessionXp(currentSession.duration, state.streak, bonuses);
    const loot = generateLoot(currentSession.duration, bonuses);

    dispatch({ type: 'COMPLETE_SESSION', payload: { xp: totalXp, loot } });
    return { xp: totalXp, loot };
  }, [state]);

  const quitSession = useCallback((percentCompleted: number) => {
    const xpPenalty = calculateQuitPenalty(percentCompleted);
    dispatch({ type: 'QUIT_SESSION', payload: { xpPenalty } });
  }, []);

  const equipItem = useCallback((item: Item) => {
    dispatch({ type: 'EQUIP_ITEM', payload: item });
  }, []);

  const unequipItem = useCallback((slot: string) => {
    dispatch({ type: 'UNEQUIP_ITEM', payload: slot });
  }, []);

  const placeDecor = useCallback((item: Item, roomId: string) => {
    dispatch({ type: 'PLACE_DECOR', payload: { item, roomId } });
  }, []);

  const removeDecor = useCallback((itemId: string, roomId: string) => {
    dispatch({ type: 'REMOVE_DECOR', payload: { itemId, roomId } });
  }, []);

  const useConsumable = useCallback((itemId: string) => {
    dispatch({ type: 'USE_CONSUMABLE', payload: itemId });
  }, []);

  const getTotalBonusFn = useCallback(() => {
    return getTotalBonus(state);
  }, [state]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <div className="text-white">Loading Focus Forge...{!isOnline && ' (Offline Mode)'}</div>
        </div>
      </div>
    );
  }

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        startSession,
        completeSession,
        quitSession,
        equipItem,
        unequipItem,
        placeDecor,
        removeDecor,
        useConsumable,
        getTotalBonus: getTotalBonusFn,
      }}
    >
      {!isOnline && userId && (
        <div className="bg-yellow-600 text-white text-center py-2 text-sm">
          Offline Mode - Changes will sync when connection is restored
        </div>
      )}
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
