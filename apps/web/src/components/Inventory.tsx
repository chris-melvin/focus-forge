'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Item, RARITY_BORDERS, ItemType } from '@/types/game';

export default function Inventory() {
  const { state, equipItem, useConsumable, placeDecor } = useGame();
  const [selectedTab, setSelectedTab] = useState<ItemType | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const filteredItems = selectedTab === 'all'
    ? state.inventory
    : state.inventory.filter(item => item.type === selectedTab);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleEquip = () => {
    if (selectedItem && selectedItem.type === 'gear' || selectedItem?.type === 'weapon') {
      equipItem(selectedItem);
      setShowItemModal(false);
    }
  };

  const handleUse = () => {
    if (selectedItem && selectedItem.type === 'consumable') {
      useConsumable(selectedItem.id);
      setShowItemModal(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'weapon': return '⚔️';
      case 'gear': return '🛡️';
      case 'consumable': return '🧪';
      case 'decor': return '🏠';
      default: return '📦';
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'weapon', 'gear', 'consumable', 'decor'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab === 'all' ? '🎒 All' : `${getTypeIcon(tab)} ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`aspect-square rounded-xl border-2 bg-gray-800 p-2 flex flex-col items-center justify-center gap-1 hover:bg-gray-700 transition-colors ${
                item.rarity === 'legendary' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' :
                item.rarity === 'epic' ? 'border-purple-400' :
                item.rarity === 'rare' ? 'border-blue-400' :
                'border-gray-600'
              }`}
            >
              <div className="text-2xl">{getTypeIcon(item.type)}</div>
              <div className={`text-[10px] capitalize ${getRarityColor(item.rarity)}`}>
                {item.rarity}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <div>No items in this category</div>
        </div>
      )}

      {/* Item Detail Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowItemModal(false)}
        >
          <div
            className="bg-gray-900 border-2 rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{ borderColor: selectedItem.rarity === 'legendary' ? '#facc15' : selectedItem.rarity === 'epic' ? '#a855f7' : selectedItem.rarity === 'rare' ? '#3b82f6' : '#9ca3af' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center text-4xl"
              >
                {getTypeIcon(selectedItem.type)}
              </div>
              <h3 className={`text-xl font-bold ${getRarityColor(selectedItem.rarity)}`}>
                {selectedItem.name}
              </h3>
              <div className="text-sm text-gray-400 capitalize">
                {selectedItem.rarity} {selectedItem.type}
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 text-center">
              {selectedItem.description}
            </p>

            {selectedItem.stats && (
              <div className="bg-gray-800 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-2">Stats</div>
                <div className="space-y-1">
                  {selectedItem.stats.xpBonus && (
                    <div className="text-green-400 text-sm">+{selectedItem.stats.xpBonus}% XP</div>
                  )}
                  {selectedItem.stats.lootBonus && (
                    <div className="text-blue-400 text-sm">+{selectedItem.stats.lootBonus}% Loot</div>
                  )}
                  {selectedItem.stats.attack && (
                    <div className="text-red-400 text-sm">+{selectedItem.stats.attack} ATK</div>
                  )}
                  {selectedItem.stats.defense && (
                    <div className="text-blue-400 text-sm">+{selectedItem.stats.defense} DEF</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {(selectedItem.type === 'gear' || selectedItem.type === 'weapon') && (
                <button
                  onClick={handleEquip}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                >
                  Equip
                </button>
              )}
              {selectedItem.type === 'consumable' && (
                <button
                  onClick={handleUse}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
                >
                  Use
                </button>
              )}
              <button
                onClick={() => setShowItemModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
