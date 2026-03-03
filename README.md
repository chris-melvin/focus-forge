# ⚔️ Focus Forge

[![CI](https://github.com/chris-melvin/focus-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/chris-melvin/focus-forge/actions/workflows/ci.yml)
[![Deploy](https://github.com/chris-melvin/focus-forge/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/chris-melvin/focus-forge/actions/workflows/deploy-web.yml)

A productivity RPG that transforms your real-world focus sessions into a rewarding pixel-art game experience.

**Web:** [https://chris-melvin.github.io/focus-forge](https://chris-melvin.github.io/focus-forge)  
**Mobile:** Coming soon to App Store and Play Store

![Focus Forge](packages/assets/environment_cozy_cottage.png)

## 🎮 Features

### Core Gameplay
- ⏱️ **Focus Timer** - Customizable 15/25/45/60/90/120 minute sessions
- 📊 **XP System** - Gain experience based on session duration and bonuses
- 🎁 **Loot Drops** - Earn items, gear, and consumables (Common/Rare/Epic/Legendary)
- ⚠️ **Quit Penalty** - No loot, XP loss, streak break if you quit early
- 🔥 **Streak System** - Maintain daily streaks for bonus XP

### Character Progression
- 🆙 **Level Up** - Gain levels through focus XP (resets monthly)
- 🛡️ **Equipment** - Weapons, armor, and accessories with stat bonuses
- 🏠 **Hall System** - 5 unlockable rooms with permanent bonuses
- 💎 **Decorations** - Rare permanent items that persist forever

### Collections
- ⚔️ **Medieval** - Dark fantasy theme
- 🧙 **Fantasy** - Magic and wizardry
- ⚙️ **Steampunk** - Gears and brass
- 🤖 **Cyberpunk** - Neon and tech

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | npm workspaces |
| Web | Next.js 16 + React 19 + Tailwind 4 |
| Mobile | Expo SDK 52 + React Native 0.76 |
| Shared | TypeScript |
| State | React Context + useReducer |
| Storage | localStorage (web) / AsyncStorage (mobile) |
| CI/CD | GitHub Actions |

## 📁 Project Structure

```
focus-forge/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── src/
│   │   │   ├── components/    # FocusTimer, CharacterPanel, Inventory, HallPanel
│   │   │   └── context/       # GameContext with localStorage
│   │   └── public/assets/     # Pixel art images
│   │
│   └── mobile/                 # Expo React Native app
│       ├── src/
│       │   ├── components/    # Mobile versions of all components
│       │   ├── context/       # GameContext with AsyncStorage
│       │   └── assets/        # Asset manifest
│       └── app.json           # Expo configuration
│
├── packages/
│   ├── shared/                 # Shared game logic
│   │   ├── src/
│   │   │   ├── types/         # TypeScript types (GameState, Item, etc.)
│   │   │   ├── logic/         # Game reducer, XP/loot calculations
│   │   │   └── storage/       # Storage abstraction
│   │   └── package.json
│   │
│   └── assets/                 # 20 pixel art assets
│       ├── *.png              # Base assets
│       └── collections/       # Themed collections
│
├── .github/workflows/          # CI/CD pipelines
├── scripts/                    # Build scripts
└── package.json               # Root workspace config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/chris-melvin/focus-forge.git
cd focus-forge

# Install all dependencies and build shared package
npm run setup

# Copy assets to mobile app
npm run copy-assets
```

### Run Web App

```bash
npm run dev:web
# Open http://localhost:3000
```

### Run Mobile App

```bash
npm run dev:mobile
# Scan QR code with Expo Go app
```

## 📦 Building

### Web (Static Export)

```bash
npm run build:web
# Output: apps/web/dist/
```

### Mobile (EAS Build)

```bash
cd apps/mobile

# Preview build (APK for Android)
eas build --profile preview

# Production build
# iOS: eas build --profile production --platform ios
# Android: eas build --profile production --platform android
```

## 🎨 Assets

20 pixel art assets generated with AI (DALL-E 3):

| Collection | Count | Items |
|------------|-------|-------|
| Base | 10 | Character, weapons, gear, consumables, decor |
| Medieval | 2 | Reaper, tavern bar |
| Fantasy | 4 | Wizard, dragon armor, spellbook, crystal ball |
| Steampunk | 2 | Gear helmet, pocket watch |
| Cyberpunk | 2 | Neon katana, data chip |

All assets follow consistent style: 32x32px, 1px black outline, no anti-aliasing.

## 📱 Mobile Support

- ✅ iOS 13+ support
- ✅ Android 8+ support
- ✅ Dark theme
- ✅ Bottom tab navigation
- ✅ Haptic feedback
- ✅ Offline support
- ⏳ Push notifications (coming soon)

## 🧪 Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint
```

CI runs on every push:
- Type checking for shared package
- Build verification for web app
- Type checking for mobile app

## 🚢 Deployment

### Web
Auto-deploys to GitHub Pages on push to `main` branch.

### Mobile
Requires EAS Build configuration. Update `eas.json` with your credentials.

## 📝 License

MIT License - see LICENSE file for details.

## 🙏 Credits

- Pixel art generated with OpenAI DALL-E 3
- Icons: Emoji
- Built with Next.js, React, Expo

---

**Forge your focus.** ⚔️✨

[GitHub](https://github.com/chris-melvin/focus-forge) · [Issues](https://github.com/chris-melvin/focus-forge/issues) · [Discussions](https://github.com/chris-melvin/focus-forge/discussions)
