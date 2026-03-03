// API client for mobile app to sync with Railway backend

import { GameState } from '@focus-forge/shared';

const API_BASE_URL = 'https://your-app.railway.app'; // Replace with your Railway URL

interface SyncResponse {
  success: boolean;
  serverState?: GameState;
  lastSyncedAt?: string;
  conflict?: boolean;
  message?: string;
}

export async function syncGameState(
  gameState: GameState,
  authToken: string
): Promise<SyncResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        character: gameState.character,
        inventory: gameState.inventory,
        hall: gameState.hall,
        sessions: gameState.sessions,
        streak: gameState.streak,
        lastSessionDate: gameState.lastSessionDate,
        totalFocusHours: gameState.totalFocusHours,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchGameState(authToken: string): Promise<GameState | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function saveGameState(
  gameState: GameState,
  authToken: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        character: gameState.character,
        inventory: gameState.inventory,
        hall: gameState.hall,
        sessions: gameState.sessions,
        streak: gameState.streak,
        lastSessionDate: gameState.lastSessionDate,
        totalFocusHours: gameState.totalFocusHours,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
}
