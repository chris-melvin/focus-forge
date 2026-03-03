# ⚔️ Focus Forge

A productivity RPG that transforms your real-world focus sessions into a rewarding pixel-art game experience.

**Web:** Next.js + React + TypeScript  
**Mobile:** Expo + React Native  
**Shared:** TypeScript package with game logic

---

## 📁 Monorepo Structure

```
focus-forge/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── src/
│   │   │   ├── app/           # Next.js app router
│   │   │   ├── components/    # React components
│   │   │   └── context/       # Game context (uses shared)
│   │   ├── public/assets/     # Pixel art assets
│   │   └── package.json
│   │
│   └── mobile/                 # Expo mobile app
│       ├── src/
│       │   ├── context/       # Game context (uses shared)
│       │   ├── components/    # Mobile components
│       │   ├── screens/       # Screen components
│       │   └── storage/       # AsyncStorage adapter
│       ├── App.tsx
│       └── package.json
│
├── packages/
│   ├── shared/                 # Shared game logic
│   │   ├── src/
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── logic/         # Game reducer + logic
│   │   │   └── storage/       # Storage abstraction
│   │   └── package.json
│   │
│   └── assets/                 # Pixel art assets
│       ├── gallery.html
│       └── *.png
│
├── package.json               # Root workspace config
└── turbo.json                 # Turborepo config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Install Dependencies

```bash
cd focus-forge
npm install
```

### Run Web App

```bash
npm run dev:web
# Open http://localhost:3000
```

### Run Mobile App

```bash
cd apps/mobile
npm install
npm run start
# Scan QR code with Expo Go app
```

---

## 🎮 Features

### Core Gameplay
- ⏱️ **Focus Timer** - Customizable 15/25/45/60/90/120 min sessions
- 📊 **XP System** - Gain XP based on duration + bonuses
- 🎁 **Loot Drops** - Random items on session complete
- ⚠️ **Quit Penalty** - No loot, XP loss, streak break

### Character Progression
- 🆙 **Level Up** - Gain levels through focus XP
- 🛡️ **Equipment** - Weapons, armor, accessories
- 🏠 **Hall System** - 5 unlockable rooms with permanent bonuses
- 🔥 **Streaks** - Daily streaks with XP multipliers

### Items
- ⚔️ **Weapons** - Boost XP gain
- 🛡️ **Gear** - Helmets, armor, rings
- 🧪 **Consumables** - Coffee, potions, scrolls
- 🏛️ **Decor** - Permanent hall decorations (rare)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | npm workspaces |
| Web | Next.js 16 + React 19 + Tailwind 4 |
| Mobile | Expo SDK 52 + React Native 0.76 |
| Shared | TypeScript |
| State | React Context + useReducer |
| Storage | localStorage (web) / AsyncStorage (mobile) |

---

## 📦 Packages

### @focus-forge/shared
Game logic shared between web and mobile:
- Types (GameState, Item, Character, etc.)
- Game reducer (state management)
- Loot generation
- XP calculations
- Storage abstraction

### @focus-forge/web
Next.js web application with:
- Full UI components
- LocalStorage persistence
- Responsive design
- Static export for deployment

### @focus-forge/mobile
Expo React Native app with:
- Bottom tab navigation
- AsyncStorage persistence
- Mobile-optimized UI
- Haptics support (coming soon)

---

## 🎨 Assets

Pixel art assets generated with AI (DALL-E 3):
- Character sprites
- Weapons, gear, consumables
- Hall decorations
- Environment backgrounds

See `packages/assets/gallery.html` for full asset gallery.

---

## 🚧 Development Phases

- [x] Phase 1: Monorepo setup
- [x] Phase 2: Shared package extraction
- [x] Phase 3: Web app refactor
- [x] Phase 4: Expo mobile app setup
- [ ] Phase 5: Mobile UI implementation
- [ ] Phase 6: Asset optimization
- [ ] Phase 7: Feature parity testing
- [ ] Phase 8: Build & deploy

---

## 📝 License

MIT License

---

**Forge your focus.** ⚔️✨
