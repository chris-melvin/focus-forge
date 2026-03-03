// Asset manifest for Focus Forge mobile app
// Maps item icons to their image sources

export const ASSETS = {
  // Characters
  character_adventurer: require('../assets/images/character_adventurer.png'),
  character_wizard: require('../assets/images/collections/fantasy/character_wizard.png'),
  character_reaper: require('../assets/images/collections/medieval/character_reaper.png'),
  
  // Weapons
  weapon_magic_staff: require('../assets/images/weapon_magic_staff.png'),
  weapon_legendary_sword: require('../assets/images/weapon_legendary_sword.png'),
  weapon_cyber_katana: require('../assets/images/collections/cyberpunk/weapon_cyber_katana.png'),
  
  // Gear
  gear_iron_helmet: require('../assets/images/gear_iron_helmet.png'),
  gear_ruby_ring: require('../assets/images/gear_ruby_ring.png'),
  gear_dragon_armor: require('../assets/images/collections/fantasy/gear_dragon_armor.png'),
  gear_steampunk_helmet: require('../assets/images/collections/steampunk/gear_steampunk_helmet.png'),
  gear_pocketwatch: require('../assets/images/collections/steampunk/gear_pocketwatch.png'),
  
  // Consumables
  item_coffee_cup: require('../assets/images/item_coffee_cup.png'),
  item_health_potion: require('../assets/images/item_health_potion.png'),
  item_magic_scroll: require('../assets/images/item_magic_scroll.png'),
  item_spellbook: require('../assets/images/collections/fantasy/item_spellbook.png'),
  item_datachip: require('../assets/images/collections/cyberpunk/item_datachip.png'),
  
  // Decor
  decor_bookshelf: require('../assets/images/decor_bookshelf.png'),
  decor_crystal_ball: require('../assets/images/collections/fantasy/decor_crystal_ball.png'),
  decor_tavern_bar: require('../assets/images/collections/medieval/decor_tavern_bar.png'),
  
  // Environments
  environment_cozy_cottage: require('../assets/images/environment_cozy_cottage.png'),
};

export function getAsset(iconName: string): any {
  return ASSETS[iconName as keyof typeof ASSETS] || ASSETS.item_health_potion;
}
