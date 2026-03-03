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
  isSaving: boolean;
  lastSyncedAt: Date | null;
  startSession: (duration: number, activity: string) => void;
  completeSession: () => { xp: number; loot: Item[] };
  quitSession: (percentCompleted: number) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: string) => void;
  placeDecor: (item: Item, roomId: string) => void;
  removeDecor: (itemId: string, roomId: string) => void;
  useConsumable: (itemId: string) => void;
  getTotalBonus: () => { xpBonus: number; lootBonus: number };
  syncNow: () => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Load game state from API on mount
  useEffect(() => {
    if (!isLoaded) return;
    
    const loadGameState = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/game');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'LOAD_STATE', payload: data });
          setLastSyncedAt(new Date());
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, [userId, isLoaded]);

  // Save game state to API when it changes
  const saveGameState = useCallback(async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: state.character,
          inventory: state.inventory,
          hall: state.hall,
          sessions: state.sessions,
          streak: state.streak,
          lastSessionDate: state.lastSessionDate,
          totalFocusHours: state.totalFocusHours,
        }),
      });

      if (response.ok) {
        setLastSyncedAt(new Date());
      }
    } catch (error) {
      console.error('Failed to save game state:', error);
    } finally {
      setIsSaving(false);
    }
  }, [state, userId]);

  // Debounced save
  useEffect(() => {
    if (!userId || isLoading) return;
    
    const timer = setTimeout(() => {
      saveGameState();
    }, 1000);

    return () => clearTimeout(timer);
  }, [state, userId, isLoading, saveGameState]);

  // Manual sync function
  const syncNow = useCallback(async () => {
    await saveGameState();
  }, [saveGameState]);

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

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        isSaving,
        lastSyncedAt,
        startSession,
        completeSession,
        quitSession,
        equipItem,
        unequipItem,
        placeDecor,
        removeDecor,
        useConsumable,
        getTotalBonus: getTotalBonusFn,
        syncNow,
      }}
    >
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
