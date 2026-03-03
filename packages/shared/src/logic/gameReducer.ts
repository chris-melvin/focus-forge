import { GameState, Character, HallRoom, FocusSession, Item, HALL_ROOMS } from '../types/game';

export type GameAction =
  | { type: 'START_SESSION'; payload: { duration: number; activity: string } }
  | { type: 'COMPLETE_SESSION'; payload: { xp: number; loot: Item[] } }
  | { type: 'QUIT_SESSION'; payload: { xpPenalty: number } }
  | { type: 'EQUIP_ITEM'; payload: Item }
  | { type: 'UNEQUIP_ITEM'; payload: string }
  | { type: 'PLACE_DECOR'; payload: { item: Item; roomId: string } }
  | { type: 'REMOVE_DECOR'; payload: { itemId: string; roomId: string } }
  | { type: 'USE_CONSUMABLE'; payload: string }
  | { type: 'LOAD_STATE'; payload: GameState };

const initialCharacter: Character = {
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 100,
  maxHp: 100,
  gold: 50,
  equipment: {},
};

export const initialState: GameState = {
  character: initialCharacter,
  inventory: [],
  hall: HALL_ROOMS.map(room => ({ ...room, decorations: [] })),
  sessions: [],
  streak: 0,
  lastSessionDate: null,
  totalFocusHours: 0,
};

export function calculateXpForLevel(level: number): number {
  return level * 100;
}

export function generateLoot(
  sessionDuration: number, 
  bonuses: { xpBonus: number; lootBonus: number }
): Item[] {
  const loot: Item[] = [];
  const rollCount = Math.floor(sessionDuration / 25) + 1;
  
  for (let i = 0; i < rollCount; i++) {
    const roll = Math.random() * 100;
    let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
    
    const adjustedRoll = roll - bonuses.lootBonus;
    
    if (adjustedRoll < 2) rarity = 'legendary';
    else if (adjustedRoll < 10) rarity = 'epic';
    else if (adjustedRoll < 30) rarity = 'rare';
    
    if (Math.random() > 0.5) {
      loot.push({
        id: `loot_${Date.now()}_${i}`,
        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Reward`,
        description: `A ${rarity} item earned through focus.`,
        type: 'consumable',
        rarity,
        icon: 'item_health_potion',
      });
    }
  }
  
  return loot;
}

export function calculateQuitPenalty(percentCompleted: number): number {
  if (percentCompleted < 25) return 100;
  if (percentCompleted < 50) return 50;
  if (percentCompleted < 75) return 25;
  if (percentCompleted < 90) return 10;
  return 0;
}

export function calculateSessionXp(
  duration: number,
  streak: number,
  bonuses: { xpBonus: number; lootBonus: number }
): number {
  const baseXp = duration;
  const streakBonus = 1 + (streak * 0.1);
  return Math.floor(baseXp * (1 + bonuses.xpBonus / 100) * streakBonus);
}

export function getTotalBonus(state: GameState): { xpBonus: number; lootBonus: number } {
  let xpBonus = 0;
  let lootBonus = 0;

  // Equipment bonuses
  Object.values(state.character.equipment).forEach(item => {
    if (item?.stats?.xpBonus) xpBonus += item.stats.xpBonus;
    if (item?.stats?.lootBonus) lootBonus += item.stats.lootBonus;
  });

  // Hall decoration bonuses
  state.hall.forEach(room => {
    room.decorations.forEach(decor => {
      if (decor.stats?.xpBonus) xpBonus += decor.stats.xpBonus;
      if (decor.stats?.lootBonus) lootBonus += decor.stats.lootBonus;
    });
  });

  // Room unlock bonuses
  state.hall.forEach(room => {
    if (state.totalFocusHours >= room.unlockHours) {
      if (room.bonus.type === 'xp') xpBonus += room.bonus.value;
      if (room.bonus.type === 'loot') lootBonus += room.bonus.value;
    }
  });

  return { xpBonus, lootBonus };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'START_SESSION': {
      const newSession: FocusSession = {
        duration: action.payload.duration,
        activity: action.payload.activity,
        startTime: new Date().toISOString(),
        completed: false,
        xpGained: 0,
        lootGained: [],
      };
      return {
        ...state,
        sessions: [...state.sessions, newSession],
      };
    }

    case 'COMPLETE_SESSION': {
      const updatedSessions = [...state.sessions];
      const currentSession = updatedSessions[updatedSessions.length - 1];
      if (!currentSession) return state;
      
      currentSession.completed = true;
      currentSession.endTime = new Date().toISOString();
      currentSession.xpGained = action.payload.xp;
      currentSession.lootGained = action.payload.loot;

      let newXp = state.character.xp + action.payload.xp;
      let newLevel = state.character.level;
      let newMaxXp = state.character.maxXp;

      // Level up logic
      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel++;
        newMaxXp = calculateXpForLevel(newLevel);
      }

      // Check streak
      const today = new Date().toDateString();
      const lastDate = state.lastSessionDate;
      let newStreak = state.streak;
      
      if (lastDate) {
        const last = new Date(lastDate);
        const diffDays = Math.floor(
          (new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          newStreak++;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      return {
        ...state,
        character: {
          ...state.character,
          level: newLevel,
          xp: newXp,
          maxXp: newMaxXp,
        },
        inventory: [...state.inventory, ...action.payload.loot],
        sessions: updatedSessions,
        streak: newStreak,
        lastSessionDate: today,
        totalFocusHours: state.totalFocusHours + (currentSession.duration / 60),
      };
    }

    case 'QUIT_SESSION': {
      const updatedSessions = [...state.sessions];
      const currentSession = updatedSessions[updatedSessions.length - 1];
      if (currentSession) {
        currentSession.completed = false;
        currentSession.endTime = new Date().toISOString();
      }

      let newXp = state.character.xp - action.payload.xpPenalty;
      if (newXp < 0) newXp = 0;

      return {
        ...state,
        character: {
          ...state.character,
          xp: newXp,
        },
        sessions: updatedSessions,
        streak: 0,
      };
    }

    case 'EQUIP_ITEM': {
      const item = action.payload;
      if (!item.slot) return state;

      return {
        ...state,
        character: {
          ...state.character,
          equipment: {
            ...state.character.equipment,
            [item.slot]: item,
          },
        },
        inventory: state.inventory.filter(i => i.id !== item.id),
      };
    }

    case 'UNEQUIP_ITEM': {
      const slot = action.payload;
      const item = state.character.equipment[slot as keyof typeof state.character.equipment];
      if (!item) return state;

      const newEquipment = { ...state.character.equipment };
      delete newEquipment[slot as keyof typeof newEquipment];

      return {
        ...state,
        character: {
          ...state.character,
          equipment: newEquipment,
        },
        inventory: [...state.inventory, item],
      };
    }

    case 'PLACE_DECOR': {
      const { item, roomId } = action.payload;
      return {
        ...state,
        hall: state.hall.map(room =>
          room.id === roomId
            ? { ...room, decorations: [...room.decorations, item] }
            : room
        ),
        inventory: state.inventory.filter(i => i.id !== item.id),
      };
    }

    case 'REMOVE_DECOR': {
      const { itemId, roomId } = action.payload;
      const room = state.hall.find(r => r.id === roomId);
      if (!room) return state;
      const item = room.decorations.find(d => d.id === itemId);
      if (!item) return state;

      return {
        ...state,
        hall: state.hall.map(r =>
          r.id === roomId
            ? { ...r, decorations: r.decorations.filter(d => d.id !== itemId) }
            : r
        ),
        inventory: [...state.inventory, item],
      };
    }

    case 'USE_CONSUMABLE': {
      return {
        ...state,
        inventory: state.inventory.filter(i => i.id !== action.payload),
      };
    }

    default:
      return state;
  }
}
