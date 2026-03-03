import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Vibration,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { ACTIVITIES, DURATIONS, Item } from '@focus-forge/shared';

export default function FocusTimer() {
  const { state, startSession, completeSession, quitSession, getTotalBonus } = useGame();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0].id);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [sessionResult, setSessionResult] = useState({ xp: 0, loot: [] as Item[] });

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
    Vibration.vibrate(50);
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
    Vibration.vibrate([0, 100, 50, 100]);
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalEmoji}>🎉</Text>
          <Text style={styles.modalTitle}>Focus Complete!</Text>
          
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Experience Gained</Text>
            <Text style={styles.resultValue}>+{sessionResult.xp} XP</Text>
          </View>
          
          {sessionResult.loot.length > 0 && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Loot Earned</Text>
              {sessionResult.loot.map((item, idx) => (
                <View key={idx} style={[styles.lootItem, 
                  item.rarity === 'legendary' ? styles.legendary :
                  item.rarity === 'epic' ? styles.epic :
                  item.rarity === 'rare' ? styles.rare : styles.common
                ]}>
                  <Text style={styles.lootText}>{item.rarity.toUpperCase()} Reward</Text>
                </View>
              ))}
            </View>
          )}
          
          {state.streak > 0 && (
            <Text style={styles.streakText}>🔥 {state.streak} Day Streak!</Text>
          )}
          
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setShowCompleteModal(false)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showQuitModal) {
    const percentCompleted = getProgress();
    return (
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.quitModal]}>
          <Text style={styles.modalEmoji}>💔</Text>
          <Text style={[styles.modalTitle, styles.quitTitle]}>Session Abandoned</Text>
          
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Progress</Text>
            <Text style={styles.resultValue}>{Math.floor(percentCompleted)}%</Text>
          </View>
          
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Penalty</Text>
            <Text style={[styles.resultValue, styles.penaltyText]}>
              {percentCompleted < 25 ? '-100 XP' :
               percentCompleted < 50 ? '-50 XP' :
               percentCompleted < 75 ? '-25 XP' : '-10 XP'}
            </Text>
          </View>
          
          <Text style={styles.streakBroken}>🔥 Streak Broken</Text>
          
          <TouchableOpacity
            style={[styles.continueButton, styles.quitButton]}
            onPress={() => setShowQuitModal(false)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!isActive ? (
        <>
          <Text style={styles.title}>Start Focus Session</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Activity</Text>
            <View style={styles.activitiesGrid}>
              {ACTIVITIES.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  onPress={() => setSelectedActivity(activity.id)}
                  style={[
                    styles.activityButton,
                    selectedActivity === activity.id && styles.activitySelected,
                    { backgroundColor: selectedActivity === activity.id ? '#3b82f6' : '#1e293b' }
                  ]}
                >
                  <Text style={styles.activityEmoji}>{activity.icon}</Text>
                  <Text style={[
                    styles.activityText,
                    selectedActivity === activity.id && styles.activityTextSelected
                  ]}>
                    {activity.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration</Text>
            <View style={styles.durationRow}>
              {DURATIONS.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  onPress={() => {
                    setSelectedDuration(duration);
                    setTimeRemaining(duration * 60);
                  }}
                  style={[
                    styles.durationButton,
                    selectedDuration === duration && styles.durationSelected
                  ]}
                >
                  <Text style={[
                    styles.durationText,
                    selectedDuration === duration && styles.durationTextSelected
                  ]}>
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {(bonuses.xpBonus > 0 || bonuses.lootBonus > 0) && (
            <View style={styles.bonusBox}>
              <Text style={styles.bonusTitle}>Active Bonuses</Text>
              <View style={styles.bonusRow}>
                {bonuses.xpBonus > 0 && (
                  <Text style={styles.xpBonus}>+{bonuses.xpBonus}% XP</Text>
                )}
                {bonuses.lootBonus > 0 && (
                  <Text style={styles.lootBonus}>+{bonuses.lootBonus}% Loot</Text>
                )}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Focus Session</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.activeContainer}>
          <View style={[styles.activityBadge, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.activityBadgeEmoji}>{getActivity()?.icon}</Text>
            <Text style={styles.activityBadgeText}>{getActivity()?.name}</Text>
          </View>
          
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${getProgress()}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.floor(getProgress())}% Complete</Text>
          </View>

          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.controlButton, isPaused && styles.pauseButton]}
              onPress={handlePauseToggle}
            >
              <Text style={styles.controlButtonText}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.quitControlButton]}
              onPress={handleQuit}
            >
              <Text style={styles.controlButtonText}>Quit</Text>
            </TouchableOpacity>
          </View>

          {isPaused && (
            <Text style={styles.pausedText}>Session paused. Resume to continue.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityButton: {
    width: '31%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activitySelected: {
    borderColor: '#3b82f6',
  },
  activityEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  activityText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  activityTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  durationSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  durationTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  bonusBox: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  bonusTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  bonusRow: {
    flexDirection: 'row',
    gap: 16,
  },
  xpBonus: {
    color: '#4ade80',
    fontWeight: '600',
  },
  lootBonus: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  activityBadgeEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  activityBadgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  progressText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  controlButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#eab308',
  },
  quitControlButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pausedText: {
    color: '#eab308',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  quitModal: {
    borderColor: '#ef4444',
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 20,
  },
  quitTitle: {
    color: '#ef4444',
  },
  resultBox: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  resultLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 4,
  },
  resultValue: {
    color: '#fbbf24',
    fontSize: 24,
    fontWeight: 'bold',
  },
  penaltyText: {
    color: '#ef4444',
  },
  lootItem: {
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  legendary: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  epic: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  rare: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  common: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  lootText: {
    color: '#fff',
    fontSize: 12,
  },
  streakText: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 8,
  },
  streakBroken: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 8,
  },
  continueButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  quitButton: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
