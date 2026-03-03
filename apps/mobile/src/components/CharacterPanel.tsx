import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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

  const equipmentSlots = [
    { key: 'weapon', icon: '⚔️', label: 'Weapon' },
    { key: 'head', icon: '🪖', label: 'Head' },
    { key: 'body', icon: '👕', label: 'Body' },
    { key: 'hands', icon: '🧤', label: 'Hands' },
    { key: 'feet', icon: '👢', label: 'Feet' },
    { key: 'accessory', icon: '💍', label: 'Accessory' },
  ];

  return (
    <ScrollView style={styles.container}>
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
                style={[styles.xpBarFill, { width: `${getLevelProgress()}%` }]}
              />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HP</Text>
              <Text style={styles.statValueRed}>
                {character.hp}/{character.maxHp}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Gold</Text>
              <Text style={styles.statValueYellow}>🪙 {character.gold}</Text>
            </View>
          </View>

          {streak > 0 && (
            <View style={[styles.streakContainer, { borderColor: getStreakColor() }]}>
              <Text style={[styles.streakEmoji, { color: getStreakColor() }]}>
                {getStreakEmoji()}
              </Text>
              <View>
                <Text style={[styles.streakCount, { color: getStreakColor() }]}>
                  {streak} Day Streak
                </Text>
                <Text style={styles.streakBonus}>
                  +{Math.min(50, streak * 10)}% XP Bonus
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Equipment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        <View style={styles.equipmentGrid}>
          {equipmentSlots.map((slot) => {
            const item = character.equipment[slot.key as keyof typeof character.equipment];
            return (
              <View
                key={slot.key}
                style={[
                  styles.equipmentSlot,
                  item && {
                    borderColor:
                      item.rarity === 'legendary'
                        ? '#fbbf24'
                        : item.rarity === 'epic'
                        ? '#a855f7'
                        : item.rarity === 'rare'
                        ? '#3b82f6'
                        : '#9ca3af',
                  },
                ]}
              >
                {item ? (
                  <>
                    <Text style={styles.equipmentIcon}>{slot.icon}</Text>
                    <Text style={styles.equipmentRarity}>{item.rarity}</Text>
                  </>
                ) : (
                  <Text style={styles.emptySlot}>{slot.label}</Text>
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
          <View style={styles.bonusesContainer}>
            {bonuses.xpBonus > 0 && (
              <View style={styles.bonusItem}>
                <Text>📚</Text>
                <Text style={styles.bonusTextXp}>+{bonuses.xpBonus}% XP</Text>
              </View>
            )}
            {bonuses.lootBonus > 0 && (
              <View style={styles.bonusItem}>
                <Text>🎁</Text>
                <Text style={styles.bonusTextLoot}>+{bonuses.lootBonus}% Loot</Text>
              </View>
            )}
          </View>
        </View>
      )}

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
  headerCard: {
    backgroundColor: '#1e293b',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 20,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  levelBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: -10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsSection: {
    flex: 1,
  },
  xpBarContainer: {
    marginBottom: 15,
  },
  xpBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  xpLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  xpValue: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpBar: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  statValueRed: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statValueYellow: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  streakBonus: {
    color: '#94a3b8',
    fontSize: 12,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
    fontSize: 28,
    marginBottom: 4,
  },
  equipmentRarity: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  emptySlot: {
    color: '#64748b',
    fontSize: 12,
  },
  bonusesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  bonusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bonusTextXp: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  bonusTextLoot: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
});
