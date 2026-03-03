// types/game.ts

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'weapon' | 'gear' | 'consumable' | 'decor';
export type GearSlot = 'head' | 'body' | 'hands' | 'feet' | 'weapon' | 'accessory';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: Rarity;
  icon: string;
  stats?: {
    xpBonus?: number;
    lootBonus?: number;
    defense?: number;
    attack?: number;
  };
  effect?: string;
  slot?: GearSlot;
  room?: string; // For decor items
}

export interface Character {
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  gold: number;
  equipment: {
    head?: Item;
    body?: Item;
    hands?: Item;
    feet?: Item;
    weapon?: Item;
    accessory?: Item;
  };
}

export interface HallRoom {
  id: string;
  name: string;
  unlockHours: number;
  bonus: {
    type: 'xp' | 'loot' | 'stamina' | 'rareChance' | 'legendaryChance';
    value: number;
  };
  decorations: Item[];
  maxDecorations: number;
}

export interface FocusSession {
  duration: number; // minutes
  activity: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  xpGained: number;
  lootGained: Item[];
}

export interface GameState {
  character: Character;
  inventory: Item[];
  hall: HallRoom[];
  sessions: FocusSession[];
  streak: number;
  lastSessionDate: string | null;
  totalFocusHours: number;
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
};

export const RARITY_BORDERS: Record<Rarity, string> = {
  common: 'border-gray-400',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-400',
};

export const ACTIVITIES = [
  { id: 'work', name: 'Deep Work', icon: '💼', color: 'bg-blue-500' },
  { id: 'study', name: 'Study', icon: '📚', color: 'bg-green-500' },
  { id: 'creative', name: 'Creative', icon: '🎨', color: 'bg-purple-500' },
  { id: 'exercise', name: 'Exercise', icon: '💪', color: 'bg-orange-500' },
  { id: 'reading', name: 'Reading', icon: '📖', color: 'bg-indigo-500' },
  { id: 'meditation', name: 'Meditation', icon: '🧘', color: 'bg-teal-500' },
];

export const DURATIONS = [15, 25, 45, 60, 90, 120];

export const ITEMS: Item[] = [
  // Weapons
  {
    id: 'weapon_magic_staff',
    name: 'Crystal Staff',
    description: 'A wooden staff topped with a glowing blue crystal.',
    type: 'weapon',
    rarity: 'rare',
    icon: '/assets/weapon_magic_staff.png',
    stats: { xpBonus: 5 },
    slot: 'weapon',
  },
  {
    id: 'weapon_legendary_sword',
    name: 'Blade of Eternal Focus',
    description: 'A golden sword radiating orange energy.',
    type: 'weapon',
    rarity: 'legendary',
    icon: '/assets/weapon_legendary_sword.png',
    stats: { xpBonus: 25, attack: 50 },
    slot: 'weapon',
  },
  // Gear
  {
    id: 'gear_iron_helmet',
    name: 'Iron Helm',
    description: 'Basic protective headgear.',
    type: 'gear',
    rarity: 'common',
    icon: '/assets/gear_iron_helmet.png',
    stats: { defense: 2 },
    slot: 'head',
  },
  {
    id: 'gear_ruby_ring',
    name: 'Ring of the Scholar',
    description: 'A golden ring with a glowing ruby.',
    type: 'gear',
    rarity: 'epic',
    icon: '/assets/gear_ruby_ring.png',
    stats: { xpBonus: 10 },
    slot: 'accessory',
  },
  // Consumables
  {
    id: 'item_coffee_cup',
    name: 'Focus Coffee',
    description: 'A steaming cup of coffee.',
    type: 'consumable',
    rarity: 'common',
    icon: '/assets/item_coffee_cup.png',
    effect: 'xp_boost_10',
  },
  {
    id: 'item_health_potion',
    name: 'Health Potion',
    description: 'Restores HP between sessions.',
    type: 'consumable',
    rarity: 'common',
    icon: '/assets/item_health_potion.png',
    effect: 'heal_30',
  },
  {
    id: 'item_magic_scroll',
    name: 'Scroll of Focus',
    description: 'Grants immunity to early-quit penalty.',
    type: 'consumable',
    rarity: 'rare',
    icon: '/assets/item_magic_scroll.png',
    effect: 'quit_protection',
  },
  // Decor
  {
    id: 'decor_bookshelf',
    name: 'Ancient Bookshelf',
    description: 'A wooden bookshelf filled with colorful tomes.',
    type: 'decor',
    rarity: 'rare',
    icon: '/assets/decor_bookshelf.png',
    stats: { xpBonus: 3 },
    room: 'library',
  },
];

export const HALL_ROOMS: HallRoom[] = [
  {
    id: 'library',
    name: 'Library',
    unlockHours: 10,
    bonus: { type: 'xp', value: 5 },
    decorations: [],
    maxDecorations: 4,
  },
  {
    id: 'treasury',
    name: 'Treasury',
    unlockHours: 25,
    bonus: { type: 'loot', value: 3 },
    decorations: [],
    maxDecorations: 3,
  },
  {
    id: 'garden',
    name: 'Meditation Garden',
    unlockHours: 50,
    bonus: { type: 'stamina', value: 10 },
    decorations: [],
    maxDecorations: 5,
  },
  {
    id: 'forge',
    name: 'Forge',
    unlockHours: 100,
    bonus: { type: 'rareChance', value: 5 },
    decorations: [],
    maxDecorations: 3,
  },
  {
    id: 'observatory',
    name: 'Observatory',
    unlockHours: 200,
    bonus: { type: 'legendaryChance', value: 2 },
    decorations: [],
    maxDecorations: 2,
  },
];
