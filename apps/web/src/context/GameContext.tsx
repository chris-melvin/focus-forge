'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  GameState,
  Item,
  gameReducer,
  initialState,
  generateLoot,
  calculateQuitPenalty,
  calculateSessionXp,
  getTotalBonus,
  loadGameState,
  saveGameState,
  webStorage,
} from '@focus-forge/shared';

interface GameContextType {
  state: GameState;
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

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const load = async () => {
      const saved = await loadGameState(webStorage);
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: saved });
      }
    };
    load();
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    const save = async () => {
      await saveGameState(webStorage, state);
    };
    save();
  }, [state]);

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
