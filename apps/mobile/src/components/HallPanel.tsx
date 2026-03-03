import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { HallRoom } from '@focus-forge/shared';

export default function HallPanel() {
  const { state, placeDecor, removeDecor } = useGame();
  const [selectedRoom, setSelectedRoom] = useState<HallRoom | null>(null);
  const [showDecorModal, setShowDecorModal] = useState(false);

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

  const getBonusLabel = (type: string) => {
    switch (type) {
      case 'xp': return 'XP Bonus';
      case 'loot': return 'Loot Bonus';
      case 'stamina': return 'Stamina';
      case 'rareChance': return 'Rare Chance';
      case 'legendaryChance': return 'Legendary Chance';
      default: return type;
    }
  };

  const decorItems = state.inventory.filter(item => item.type === 'decor');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Focus Hall</Text>
        
        <Text style={styles.subtitle}>
          Decorate your hall to gain permanent bonuses. Decor items are rare and persist forever.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{state.hall.filter(r => isRoomUnlocked(r)).length}</Text>
            <Text style={styles.statLabel}>Rooms Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.floor(state.totalFocusHours)}h</Text>
            <Text style={styles.statLabel}>Total Focus</Text>
          </View>
        </View>

        <View style={styles.roomsContainer}>
          {state.hall.map((room) => {
            const unlocked = isRoomUnlocked(room);
            const progress = Math.min(100, (state.totalFocusHours / room.unlockHours) * 100);

            return (
              <TouchableOpacity
                key={room.id}
                onPress={() => {
                  if (unlocked) {
                    setSelectedRoom(room);
                    setShowDecorModal(true);
                  }
                }}
                style={[
                  styles.roomCard,
                  !unlocked && styles.roomLocked,
                  unlocked && room.decorations.length > 0 && styles.roomDecorated
                ]}
                activeOpacity={unlocked ? 0.7 : 1}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomIcon}>{getRoomIcon(room.id)}</Text>
                  <View style={[
                    styles.statusBadge,
                    unlocked ? styles.unlockedBadge : styles.lockedBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {unlocked ? 'Unlocked' : 'Locked'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.roomName}>{room.name}</Text>

                {unlocked ? (
                  <>
                    <View style={styles.bonusRow}>
                      <Text style={styles.bonusText}>
                        +{room.bonus.value}% {getBonusLabel(room.bonus.type)}
                      </Text>
                    </View>
                    
                    <View style={styles.decorInfo}>
                      <Text style={styles.decorCount}>
                        Decorations: {room.decorations.length}/{room.maxDecorations}
                      </Text>
                      {room.decorations.length > 0 && (
                        <Text style={styles.decorStatus}>✨ Active</Text>
                      )}
                    </View>
                  </>
                ) : (
                  <View style={styles.unlockSection}>
                    <Text style={styles.unlockText}>
                      Unlock at {room.unlockHours}h focus time
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.floor(progress)}%</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Room Detail Modal */}
      {showDecorModal && selectedRoom && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>{getRoomIcon(selectedRoom.id)}</Text>
              <View>
                <Text style={styles.modalTitle}>{selectedRoom.name}</Text>
                <Text style={styles.modalBonus}>
                  +{selectedRoom.bonus.value}% {getBonusLabel(selectedRoom.bonus.type)}
                </Text>
              </View>
            </View>

            <Text style={styles.decorTitle}>
              Decorations ({selectedRoom.decorations.length}/{selectedRoom.maxDecorations})
            </Text>

            {selectedRoom.decorations.length > 0 ? (
              <View style={styles.decorList}>
                {selectedRoom.decorations.map((decor) => (
                  <View key={decor.id} style={styles.decorItem}>
                    <View style={styles.decorInfo}>
                      <Text style={styles.decorIcon}>🏠</Text>
                      <View>
                        <Text style={styles.decorName}>{decor.name}</Text>
                        {decor.stats?.xpBonus && (
                          <Text style={styles.decorBonus}>+{decor.stats.xpBonus}% XP</Text>
                        )}
                        {decor.stats?.lootBonus && (
                          <Text style={styles.decorBonus}>+{decor.stats.lootBonus}% Loot</Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        removeDecor(decor.id, selectedRoom.id);
                        setShowDecorModal(false);
                      }}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyDecor}>
                <Text style={styles.emptyText}>No decorations placed</Text>
              </View>
            )}

            {selectedRoom.decorations.length < selectedRoom.maxDecorations && decorItems.length > 0 && (
              <View style={styles.availableDecor}>
                <Text style={styles.availableTitle}>Available Decor</Text>
                <View style={styles.decorGrid}>
                  {decorItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        placeDecor(item, selectedRoom.id);
                        setShowDecorModal(false);
                      }}
                      style={styles.availableItem}
                    >
                      <Text style={styles.availableIcon}>🏠</Text>
                      <Text style={styles.availableName}>{item.name}</Text>
                      {item.stats?.xpBonus && (
                        <Text style={styles.availableBonus}>+{item.stats.xpBonus}% XP</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setShowDecorModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  roomsContainer: {
    gap: 12,
  },
  roomCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  roomLocked: {
    opacity: 0.7,
    borderColor: '#1e293b',
  },
  roomDecorated: {
    borderColor: '#fbbf24',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomIcon: {
    fontSize: 28,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unlockedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  lockedBadge: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  bonusRow: {
    marginBottom: 8,
  },
  bonusText: {
    color: '#4ade80',
    fontSize: 14,
  },
  decorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  decorCount: {
    color: '#64748b',
    fontSize: 12,
  },
  decorStatus: {
    color: '#fbbf24',
    fontSize: 12,
  },
  unlockSection: {
    marginTop: 4,
  },
  unlockText: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  progressText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBonus: {
    color: '#4ade80',
    fontSize: 14,
  },
  decorTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 12,
  },
  decorList: {
    gap: 8,
    marginBottom: 20,
  },
  decorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
  },
  decorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  decorIcon: {
    fontSize: 24,
  },
  decorName: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  decorBonus: {
    color: '#4ade80',
    fontSize: 12,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyDecor: {
    backgroundColor: '#0f172a',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: '#64748b',
  },
  availableDecor: {
    marginBottom: 20,
  },
  availableTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 12,
  },
  decorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availableItem: {
    width: '31%',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  availableIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  availableName: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
  availableBonus: {
    color: '#4ade80',
    fontSize: 10,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
