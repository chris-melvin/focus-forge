'use client';

import React, { useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import FocusTimer from '@/components/FocusTimer';
import CharacterPanel from '@/components/CharacterPanel';
import Inventory from '@/components/Inventory';
import HallPanel from '@/components/HallPanel';
import { useGame } from '@/context/GameContext';
import Link from 'next/link';

type Tab = 'focus' | 'character' | 'inventory' | 'hall';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const { state, isLoading } = useGame();
  const { isLoaded, userId } = useAuth();

  const tabs = [
    { id: 'focus' as Tab, label: 'Focus', icon: '🎯' },
    { id: 'character' as Tab, label: 'Character', icon: '🧙‍♂️' },
    { id: 'inventory' as Tab, label: 'Inventory', icon: '🎒' },
    { id: 'hall' as Tab, label: 'Hall', icon: '🏰' },
  ];

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚔️</div>
              <div>
                <h1 className="font-bold text-lg">Focus Forge</h1>
                <div className="text-xs text-gray-400">Productivity RPG</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span>🔥</span>
                  <span className="text-orange-400">{state.streak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="text-yellow-400">Lv.{state.character.level}</span>
                </div>
              </div>
              
              {userId ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link 
                  href="/sign-in" 
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {activeTab === 'focus' && <FocusTimer />}
          {activeTab === 'character' && <CharacterPanel />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'hall' && <HallPanel />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800">
        <div className="max-w-2xl mx-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Spacer for Nav */}
      <div className="h-20" />
    </div>
  );
}
