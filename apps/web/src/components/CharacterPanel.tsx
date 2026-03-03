'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { RARITY_COLORS } from '@/types/game';

export default function CharacterPanel() {
  const { state, getTotalBonus } = useGame();
  const { character, streak, totalFocusHours } = state;
  const bonuses = getTotalBonus();

  const getLevelProgress = () => {
    return (character.xp / character.maxXp) * 100;
  };

  const getStreakEmoji = () => {
    if (streak >= 100) return '🌟';
    if (streak >= 60) return '👑';
    if (streak >= 30) return '🌈';
    if (streak >= 14) return '🥇';
    if (streak >= 7) return '🥈';
    if (streak >= 3) return '🥉';
    return '🔥';
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'text-purple-400';
    if (streak >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <div className="flex items-start gap-6">
        {/* Character Avatar */}
        <div className="relative">
          <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center text-5xl border-2 border-gray-700">
            🧙‍♂️
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full px-2 py-1 text-xs border border-gray-700">
            Lv.{character.level}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Level {character.level}</span>
              <span className="text-yellow-400">{character.xp}/{character.maxXp} XP</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">HP</div>
              <div className="text-lg font-bold text-red-400">
                {character.hp}/{character.maxHp}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Gold</div>
              <div className="text-lg font-bold text-yellow-400">
                🪙 {character.gold}
              </div>
            </div>
          </div>

          {streak > 0 && (
            <div className={`flex items-center gap-2 ${getStreakColor()}`}>
              <span className="text-2xl">{getStreakEmoji()}</span>
              <div>
                <div className="font-bold">{streak} Day Streak</div>
                <div className="text-xs opacity-75">
                  +{Math.min(50, streak * 10)}% XP Bonus
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment */}
      <div className="mt-6">
        <h3 className="text-sm text-gray-400 mb-3">Equipment</h3>
        <div className="grid grid-cols-3 gap-2">
          {['weapon', 'head', 'body', 'hands', 'feet', 'accessory'].map((slot) => {
            const item = character.equipment[slot as keyof typeof character.equipment];
            return (
              <div
                key={slot}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs ${
                  item
                    ? `border-${item.rarity === 'legendary' ? 'yellow' : item.rarity === 'epic' ? 'purple' : item.rarity === 'rare' ? 'blue' : 'gray'}-400 bg-gray-800`
                    : 'border-gray-700 bg-gray-800/50 text-gray-600'
                }`}
                title={item?.name || slot}
              >
                {item ? (
                  <div className="text-center">
                    <div className="text-lg">{slot === 'weapon' ? '⚔️' : slot === 'head' ? '🪖' : slot === 'body' ? '👕' : slot === 'hands' ? '🧤' : slot === 'feet' ? '👢' : '💍'}</div>
                    <div className="text-[10px] capitalize truncate px-1">{item.rarity}</div>
                  </div>
                ) : (
                  slot.charAt(0).toUpperCase()
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Permanent Bonuses */}
      {(bonuses.xpBonus > 0 || bonuses.lootBonus > 0) && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-3">Permanent Bonuses</h3>
          <div className="flex flex-wrap gap-3">
            {bonuses.xpBonus > 0 && (
              <div className="flex items-center gap-2 bg-green-900/30 px-3 py-2 rounded-lg">
                <span>📚</span>
                <span className="text-green-400">+{bonuses.xpBonus}% XP</span>
              </div>
            )}
            {bonuses.lootBonus > 0 && (
              <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg">
                <span>🎁</span>
                <span className="text-blue-400">+{bonuses.lootBonus}% Loot</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Total Focus Time */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Total Focus Time: {Math.floor(totalFocusHours)} hours
      </div>
    </div>
  );
}
