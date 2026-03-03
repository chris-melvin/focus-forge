import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
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
  const [sessionResult, setSessionResult] = useState<{ xp: number; loot: Item[] }>({ xp: 0, loot: [] });

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
    Vibration.vibrate([0, 100, 50, 100, 50, 100]);
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
    Vibration.vibrate(30);
    setIsPaused(!isPaused);
  };

  const getActivity = () => ACTIVITIES.find(a => a.id === selectedActivity);

  const activity = getActivity();

  return (
    <View style={styles.container}>
      {/* Complete Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCompleteModal}
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Focus Complete!</Text>
            
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Experience Gained</Text>
              <Text style={styles.xpValue}>+{sessionResult.xp} XP</Text>
            </View>

            {sessionResult.loot.length > 0 && (
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Loot Earned</Text>
                {sessionResult.loot.map((item, idx) => (
                  <View key={idx} style={[styles.lootItem, { borderColor: 
                    item.rarity === 'legendary' ? '#fbbf24' :
                    item.rarity === 'epic' ? '#a855f7' :
                    item.rarity === 'rare' ? '#3b82f6' : '#9ca3af'
                  }]}>
                    <Text style={styles.lootText}>{item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} Reward</Text>
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
      </Modal>

      {/* Quit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQuitModal}
        onRequestClose={() => setShowQuitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.quitModal]}>
            <Text style={styles.modalEmoji}>💔</Text>
            <Text style={[styles.modalTitle, styles.quitTitle]}>Session Abandoned</Text>
            
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Progress</Text>
              <Text style={styles.quitValue}>{Math.floor(getProgress())}%</Text>
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Penalty</Text>
              <Text style={styles.quitValue}>
                {getProgress() < 25 ? '-100 XP' :
                 getProgress() < 50 ? '-50 XP' :
                 getProgress() < 75 ? '-25 XP' : '-10 XP'}
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
      </Modal>

      {!isActive ? (
        <ScrollView style={styles.setupContainer}>
          <Text style={styles.sectionTitle}>Select Activity</Text>
          <View style={styles.activitiesGrid}>
            {ACTIVITIES.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityButton,
                  selectedActivity === activity.id && styles.activityButtonActive,
                ]}
                onPress={() => {
                  Vibration.vibrate(20);
                  setSelectedActivity(activity.id);
                }}
              >
                <Text style={styles.activityEmoji}>{activity.icon}</Text>
                <Text style={[
                  styles.activityText,
                  selectedActivity === activity.id && styles.activityTextActive,
                ]}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationsRow}>
            {DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.durationButtonActive,
                ]}
                onPress={() => {
                  Vibration.vibrate(20);
                  setSelectedDuration(duration);
                  setTimeRemaining(duration * 60);
                }}
              >
                <Text style={[
                  styles.durationText,
                  selectedDuration === duration && styles.durationTextActive,
                ]}>
                  {duration}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {(bonuses.xpBonus > 0 || bonuses.lootBonus > 0) && (
            <View style={styles.bonusesBox}>
              <Text style={styles.bonusesTitle}>Active Bonuses</Text>
              <View style={styles.bonusesRow}>
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
        </ScrollView>
      ) : (
        <View style={styles.timerContainer}>
          <View style={[styles.activityBadge, { backgroundColor: activity?.id === 'work' ? '#3b82f6' : 
            activity?.id === 'study' ? '#22c55e' :
            activity?.id === 'creative' ? '#a855f7' :
            activity?.id === 'exercise' ? '#f97316' :
            activity?.id === 'reading' ? '#6366f1' : '#14b8a6'
          }]}>
            <Text style={styles.activityBadgeEmoji}>{activity?.icon}</Text>
            <Text style={styles.activityBadgeText}>{activity?.name}</Text>
          </View>

          <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
          </View>

          <Text style={styles.progressText}>{Math.floor(getProgress())}% Complete</Text>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, isPaused && styles.controlButtonPaused]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  setupContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 10,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  activityButton: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  activityButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a5f',
  },
  activityEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  activityText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  activityTextActive: {
    color: '#fff',
  },
  durationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  durationButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
  },
  durationButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a5f',
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  durationTextActive: {
    color: '#fff',
  },
  bonusesBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  bonusesTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 10,
  },
  bonusesRow: {
    flexDirection: 'row',
    gap: 15,
  },
  xpBonus: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lootBonus: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  activityBadgeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  activityBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  controlButtonPaused: {
    backgroundColor: '#ca8a04',
  },
  quitControlButton: {
    backgroundColor: '#dc2626',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pausedText: {
    color: '#ca8a04',
    marginTop: 20,
    fontSize: 14,
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
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  quitModal: {
    borderColor: '#dc2626',
  },
  modalEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 20,
  },
  quitTitle: {
    color: '#dc2626',
  },
  resultBox: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  resultLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 5,
  },
  xpValue: {
    color: '#fbbf24',
    fontSize: 28,
    fontWeight: 'bold',
  },
  quitValue: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lootItem: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  lootText: {
    color: '#fff',
    fontSize: 14,
  },
  streakText: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  streakBroken: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  quitButton: {
    backgroundColor: '#475569',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
