import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useGame } from '../context/GameContext';

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
    if (streak >= 30) return '#c084fc';
    if (streak >= 7) return '#fbbf24';
    return '#fb923c';
  };

  const getItemIcon = (slot: string) => {
    switch (slot) {
      case 'weapon': return '⚔️';
      case 'head': return '🪖';
      case 'body': return '👕';
      case 'hands': return '🧤';
      case 'feet': return '👢';
      case 'accessory': return '💍';
      default: return '❓';
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#c084fc';
      case 'rare': return '#60a5fa';
      default: return '#9ca3af';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧙‍♂️</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{character.level}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBarHeader}>
              <Text style={styles.xpLabel}>Level {character.level}</Text>
              <Text style={styles.xpValue}>{character.xp}/{character.maxXp} XP</Text>
            </View>
            <View style={styles.xpBar}>
              <View
                style={[styles.xpFill, { width: `${getLevelProgress()}%` }]}
              />
            </View>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HP</Text>
              <Text style={[styles.statValue, styles.hpColor]}>
                {character.hp}/{character.maxHp}
              </Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Gold</Text>
              <Text style={[styles.statValue, styles.goldColor]}>
                🪙 {character.gold}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Streak Card */}
      {streak > 0 && (
        <View style={[styles.streakCard, { borderColor: getStreakColor() }]}>
          <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
          <View style={styles.streakInfo}>
            <Text style={[styles.streakCount, { color: getStreakColor() }]}>
              {streak} Day Streak
            </Text>
            <Text style={styles.streakBonus}>
              +{Math.min(50, streak * 10)}% XP Bonus
            </Text>
          </View>
        </View>
      )}

      {/* Equipment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <View style={styles.equipmentGrid}>
          {['weapon', 'head', 'body', 'hands', 'feet', 'accessory'].map((slot) => {
            const item = character.equipment[slot as keyof typeof character.equipment];
            return (
              <View
                key={slot}
                style={[
                  styles.equipmentSlot,
                  item && { borderColor: getRarityColor(item.rarity) }
                ]}
              >
                {item ? (
                  <>
                    <Text style={styles.equipmentIcon}>{getItemIcon(slot)}</Text>
                    <Text style={[styles.equipmentRarity, { color: getRarityColor(item.rarity) }]}>
                      {item.rarity}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.emptySlot}>{slot.charAt(0).toUpperCase()}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Bonuses Section */}
      {(bonuses.xpBonus > 0 || bonuses.lootBonus > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permanent Bonuses</Text>
          <View style={styles.bonusRow}>
            {bonuses.xpBonus > 0 && (
              <View style={styles.bonusChip}>
                <Text style={styles.bonusIcon}>📚</Text>
                <Text style={styles.xpBonusText}>+{bonuses.xpBonus}% XP</Text>
              </View>
            )}
            {bonuses.lootBonus > 0 && (
              <View style={styles.bonusChip}>
                <Text style={styles.bonusIcon}>🎁</Text>
                <Text style={styles.lootBonusText}>+{bonuses.lootBonus}% Loot</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Inventory Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory</Text>
        <View style={styles.inventoryCard}>
          <Text style={styles.inventoryCount}>{state.inventory.length} items</Text>
          <Text style={styles.inventoryHint}>Tap to view full inventory</Text>
        </View>
      </View>

      {/* Total Focus Time */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Total Focus Time: {Math.floor(totalFocusHours)} hours
        </Text>
      </View>
    </ScrollView>
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
  headerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#334155',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#475569',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  levelBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -10,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  xpBarContainer: {
    marginBottom: 12,
  },
  xpBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  xpValue: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },
  xpBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 4,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hpColor: {
    color: '#f87171',
  },
  goldColor: {
    color: '#fbbf24',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  streakBonus: {
    color: '#94a3b8',
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 12,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentSlot: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  equipmentIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  equipmentRarity: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  emptySlot: {
    color: '#475569',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bonusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bonusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  bonusIcon: {
    fontSize: 16,
  },
  xpBonusText: {
    color: '#4ade80',
    fontWeight: '600',
  },
  lootBonusText: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  inventoryCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  inventoryCount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inventoryHint: {
    color: '#64748b',
    fontSize: 12,
  },
  footer: {
    marginTop: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 12,
  },
});
