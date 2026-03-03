# 🎮 Focus Forge - Mobile App

React Native mobile app built with Expo.

## 📱 Features

- **Focus Timer** - Customizable sessions with pause/resume
- **Character Panel** - Stats, equipment, streaks
- **Inventory** - Item management with filtering
- **Hall System** - Room decoration and bonuses
- **Haptic Feedback** - Vibration on interactions
- **Offline Support** - AsyncStorage for persistence

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FocusTimer.tsx      # Timer with modals
│   ├── CharacterPanel.tsx  # Stats display
│   ├── Inventory.tsx       # Item management
│   └── HallPanel.tsx       # Room decoration
├── context/
│   └── GameContext.tsx     # State management
├── assets/
│   └── index.ts            # Asset manifest
└── storage/
    └── index.ts            # AsyncStorage adapter
```

## 🔧 Configuration

- **app.json** - Expo configuration
- **eas.json** - EAS Build configuration

## 📦 Building

```bash
# Preview build (internal distribution)
eas build --profile preview

# Production build
eas build --profile production
```

## 📝 Notes

- Uses `@focus-forge/shared` package for game logic
- Supports iOS 13+ and Android 8+
- Dark theme only
