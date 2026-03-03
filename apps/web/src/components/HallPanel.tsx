'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { HallRoom, Item } from '@/types/game';

export default function HallPanel() {
  const { state, placeDecor, removeDecor } = useGame();
  const [selectedRoom, setSelectedRoom] = useState<HallRoom | null>(null);
  const [showDecorModal, setShowDecorModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  const isRoomUnlocked = (room: HallRoom) => {
    return state.totalFocusHours >= room.unlockHours;
  };

  const getRoomIcon = (roomId: string) => {
    switch (roomId) {
      case 'library': return '📚';
      case 'treasury': return '💰';
      case 'garden': return '🌿';
      case 'forge': return '🔨';
      case 'observatory': return '🔭';
      default: return '🏠';
    }
  };

  const handleRoomClick = (room: HallRoom) => {
    if (!isRoomUnlocked(room)) return;
    setSelectedRoom(room);
    setShowDecorModal(true);
  };

  const decorItems = state.inventory.filter(item => item.type === 'decor');

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Focus Hall</h2>
      
      <p className="text-sm text-gray-400 mb-6">
        Decorate your hall to gain permanent bonuses. Decor items are rare and persist forever.
      </p>

      {/* Rooms Grid */}
      <div className="grid grid-cols-2 gap-4">
        {state.hall.map((room) => {
          const unlocked = isRoomUnlocked(room);
          const progress = Math.min(100, (state.totalFocusHours / room.unlockHours) * 100);

          return (
            <button
              key={room.id}
              onClick={() => handleRoomClick(room)}
              disabled={!unlocked}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                unlocked
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-gray-800/50 border-gray-800 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{getRoomIcon(room.id)}</div>
                {unlocked ? (
                  <div className="text-xs bg-green-600 px-2 py-1 rounded">Unlocked</div>
                ) : (
                  <div className="text-xs bg-gray-700 px-2 py-1 rounded">Locked</div>
                )}
              </div>

              <div className="font-semibold mb-1">{room.name}</div>

              {unlocked ? (
                <>
                  <div className="text-xs text-gray-400 mb-2">
                    Bonus: +{room.bonus.value}%
                    {room.bonus.type === 'xp' ? ' XP' : 
                     room.bonus.type === 'loot' ? ' Loot' :
                     room.bonus.type === 'stamina' ? ' Stamina' :
                     room.bonus.type === 'rareChance' ? ' Rare Chance' :
                     ' Legendary Chance'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Decorations: {room.decorations.length}/{room.maxDecorations}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    Unlock at {room.unlockHours}h focus time
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Room Detail Modal */}
      {showDecorModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowDecorModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{getRoomIcon(selectedRoom.id)}</div>
              <div>
                <h3 className="text-xl font-bold">{selectedRoom.name}</h3>
                <div className="text-sm text-green-400">
                  +{selectedRoom.bonus.value}%
                  {selectedRoom.bonus.type === 'xp' ? ' XP Bonus' : 
                   selectedRoom.bonus.type === 'loot' ? ' Loot Bonus' :
                   selectedRoom.bonus.type === 'stamina' ? ' Stamina' :
                   selectedRoom.bonus.type === 'rareChance' ? ' Rare Drop Chance' :
                   ' Legendary Drop Chance'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">
                Decorations ({selectedRoom.decorations.length}/{selectedRoom.maxDecorations})
              </div>

              {selectedRoom.decorations.length > 0 ? (
                <div className="space-y-2">
                  {selectedRoom.decorations.map((decor) => (
                    <div
                      key={decor.id}
                      className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🏠</div>
                        <div>
                          <div className="font-medium">{decor.name}</div>
                          {decor.stats?.xpBonus && (
                            <div className="text-xs text-green-400">+{decor.stats.xpBonus}% XP</div>
                          )}
                          {decor.stats?.lootBonus && (
                            <div className="text-xs text-blue-400">+{decor.stats.lootBonus}% Loot</div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          removeDecor(decor.id, selectedRoom.id);
                          setShowDecorModal(false);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No decorations placed
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {selectedRoom.decorations.length < selectedRoom.maxDecorations && decorItems.length > 0 && (
                <button
                  onClick={() => {
                    setShowDecorModal(false);
                    setShowPlaceModal(true);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                >
                  Place Decor
                </button>
              )}
              <button
                onClick={() => setShowDecorModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Place Decor Modal */}
      {showPlaceModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowPlaceModal(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Select Decoration</h3>

            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {decorItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    placeDecor(item, selectedRoom.id);
                    setShowPlaceModal(false);
                  }}
                  className="p-3 rounded-xl border-2 bg-gray-800 hover:bg-gray-700 transition-colors border-gray-600"
                >
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="text-xs truncate">{item.name}</div>
                  {item.stats?.xpBonus && (
                    <div className="text-[10px] text-green-400">+{item.stats.xpBonus}% XP</div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPlaceModal(false)}
              className="w-full mt-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
