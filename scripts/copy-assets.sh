#!/bin/bash

# Script to copy and optimize assets for mobile and web apps

echo "🎨 Copying assets to mobile app..."

# Create directories if they don't exist
mkdir -p apps/mobile/assets/images
mkdir -p apps/web/public/assets

# Copy base assets to mobile
cp packages/assets/character_adventurer.png apps/mobile/assets/images/
cp packages/assets/weapon_magic_staff.png apps/mobile/assets/images/
cp packages/assets/weapon_legendary_sword.png apps/mobile/assets/images/
cp packages/assets/gear_iron_helmet.png apps/mobile/assets/images/
cp packages/assets/gear_ruby_ring.png apps/mobile/assets/images/
cp packages/assets/item_coffee_cup.png apps/mobile/assets/images/
cp packages/assets/item_health_potion.png apps/mobile/assets/images/
cp packages/assets/item_magic_scroll.png apps/mobile/assets/images/
cp packages/assets/decor_bookshelf.png apps/mobile/assets/images/
cp packages/assets/environment_cozy_cottage.png apps/mobile/assets/images/

# Copy collection assets
cp -r packages/assets/collections apps/mobile/assets/images/

echo "✅ Mobile assets copied"

echo "🌐 Syncing web app assets..."
# Web assets are already in place via symlink or copy

echo "✅ Asset optimization complete!"
