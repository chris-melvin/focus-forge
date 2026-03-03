'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ACTIVITIES, DURATIONS } from '@/types/game';
import { useGame } from '@/context/GameContext';

export default function FocusTimer() {
  const { state, startSession, completeSession, quitSession, getTotalBonus } = useGame();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [sessionResult, setSessionResult] = useState({ xp: 0, loot: [] as any[] });

  const bonuses = getTotalBonus();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = selectedDuration * 60;
    return ((total - timeRemaining) / total) * 100;
  };

  const handleStart = () => {
    startSession(selectedDuration, selectedActivity);
    setTimeRemaining(selectedDuration * 60);
    setIsActive(true);
    setIsPaused(false);
  };

  const handleComplete = () => {
    const result = completeSession();
    setSessionResult(result);
    setIsActive(false);
    setShowCompleteModal(true);
  };

  const handleQuit = () => {
    const percentCompleted = getProgress();
    quitSession(percentCompleted);
    setIsActive(false);
    setShowQuitModal(true);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const getActivity = () => ACTIVITIES.find(a => a.id === selectedActivity);

  if (showCompleteModal) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 border-2 border-green-500 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">Focus Complete!</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Experience Gained</div>
              <div className="text-3xl font-bold text-yellow-400">+{sessionResult.xp} XP</div>
            </div>
            
            {sessionResult.loot.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">Loot Earned</div>
                <div className="space-y-2">
                  {sessionResult.loot.map((item, idx) => (
                    <div key={idx} className={`p-2 rounded border ${
                      item.rarity === 'legendary' ? 'border-yellow-400 bg-yellow-900/20' :
                      item.rarity === 'epic' ? 'border-purple-400 bg-purple-900/20' :
                      item.rarity === 'rare' ? 'border-blue-400 bg-blue-900/20' :
                      'border-gray-400 bg-gray-800'
                    }`}>
                      <span className="capitalize">{item.rarity}</span> Reward
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {state.streak > 0 && (
              <div className="text-orange-400 font-semibold">
                🔥 {state.streak} Day Streak!
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowCompleteModal(false)}
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (showQuitModal) {
    const percentCompleted = getProgress();
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Session Abandoned</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Progress</div>
              <div className="text-2xl font-bold">{Math.floor(percentCompleted)}%</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Penalty</div>
              <div className="text-xl text-red-400">
                {percentCompleted < 25 ? '-100 XP' :
                 percentCompleted < 50 ? '-50 XP' :
                 percentCompleted < 75 ? '-25 XP' :
                 '-10 XP'}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Loot</div>
              <div className="text-xl text-red-400">None</div>
            </div>
            
            <div className="text-orange-400 font-semibold">
              🔥 Streak Broken
            </div>
          </div>
          
          <button
            onClick={() => setShowQuitModal(false)}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      {!isActive ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Start Focus Session</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-3">Select Activity</label>
              <div className="grid grid-cols-3 gap-3">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedActivity === activity.id
                        ? `${activity.color} border-white text-white`
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{activity.icon}</div>
                    <div className="text-xs">{activity.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Duration</label>
              <div className="flex gap-3 flex-wrap">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => {
                      setSelectedDuration(duration);
                      setTimeRemaining(duration * 60);
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedDuration === duration
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {(bonuses.xpBonus > 0 || bonuses.lootBonus > 0) && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Active Bonuses</div>
                <div className="flex gap-4">
                  {bonuses.xpBonus > 0 && (
                    <div className="text-green-400">+{bonuses.xpBonus}% XP</div>
                  )}
                  {bonuses.lootBonus > 0 && (
                    <div className="text-blue-400">+{bonuses.lootBonus}% Loot</div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-xl transition-colors"
            >
              Start Focus Session
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getActivity()?.color} mb-4`}>
              <span className="text-2xl">{getActivity()?.icon}</span>
              <span>{getActivity()?.name}</span>
            </div>
            
            <div className="text-7xl font-mono font-bold mb-4">
              {formatTime(timeRemaining)}
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            
            <div className="text-gray-400 mt-2">
              {Math.floor(getProgress())}% Complete
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePauseToggle}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                isPaused
                  ? 'bg-yellow-600 hover:bg-yellow-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button
              onClick={handleQuit}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition-colors"
            >
              Quit
            </button>
          </div>

          {isPaused && (
            <div className="mt-4 text-center text-yellow-400">
              Session paused. Resume to continue.
            </div>
          )}
        </>
      )}
    </div>
  );
}
