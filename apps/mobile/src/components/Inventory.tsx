import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { Item, ItemType } from '@focus-forge/shared';
import { getAsset } from '../assets';

export default function Inventory() {
  const { state, equipItem, useConsumable } = useGame();
  const [selectedTab, setSelectedTab] = useState<ItemType | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const filteredItems = selectedTab === 'all'
    ? state.inventory
    : state.inventory.filter(item => item.type === selectedTab);

  const handleItemPress = (item: Item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleEquip = () => {
    if (selectedItem && (selectedItem.type === 'gear' || selectedItem.type === 'weapon')) {
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
      case 'legendary': return '#fbbf24';
      case 'epic': return '#c084fc';
      case 'rare': return '#60a5fa';
      default: return '#9ca3af';
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

  const tabs = [
    { id: 'all', label: 'All', icon: '🎒' },
    { id: 'weapon', label: 'Weapons', icon: '⚔️' },
    { id: 'gear', label: 'Gear', icon: '🛡️' },
    { id: 'consumable', label: 'Items', icon: '🧪' },
    { id: 'decor', label: 'Decor', icon: '🏠' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory ({state.inventory.length})</Text>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSelectedTab(tab.id as ItemType | 'all')}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.tabActive
            ]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <ScrollView contentContainerStyle={styles.grid}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={[
                styles.itemCard,
                { borderColor: getRarityColor(item.rarity) }
              ]}
            >
              <View style={styles.itemIconContainer}>
                <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
              </View>
              <Text style={[
                styles.rarityText,
                { color: getRarityColor(item.rarity) }
              ]}>
                {item.rarity.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No items in this category</Text>
        </View>
      )}

      {/* Item Detail Modal */}
      {showItemModal && selectedItem && (
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { borderColor: getRarityColor(selectedItem.rarity) }
          ]}>
            <View style={styles.modalHeader}>
              <View style={[
                styles.modalIconContainer,
                { borderColor: getRarityColor(selectedItem.rarity) }
              ]}>
                <Text style={styles.modalTypeIcon}>{getTypeIcon(selectedItem.type)}</Text>
              </View>
              <View>
                <Text style={[
                  styles.modalItemName,
                  { color: getRarityColor(selectedItem.rarity) }
                ]}>
                  {selectedItem.name}
                </Text>
                <Text style={styles.modalItemType}>
                  {selectedItem.rarity} {selectedItem.type}
                </Text>
              </View>
            </View>

            <Text style={styles.modalDescription}>
              {selectedItem.description}
            </Text>

            {selectedItem.stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Stats</Text>
                {selectedItem.stats.xpBonus && (
                  <Text style={styles.statBonus}>+{selectedItem.stats.xpBonus}% XP</Text>
                )}
                {selectedItem.stats.lootBonus && (
                  <Text style={styles.statBonus}>+{selectedItem.stats.lootBonus}% Loot</Text>
                )}
                {selectedItem.stats.attack && (
                  <Text style={styles.statBonus}>+{selectedItem.stats.attack} ATK</Text>
                )}
                {selectedItem.stats.defense && (
                  <Text style={styles.statBonus}>+{selectedItem.stats.defense} DEF</Text>
                )}
              </View>
            )}

            <View style={styles.modalButtons}>
              {(selectedItem.type === 'gear' || selectedItem.type === 'weapon') && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEquip}
                >
                  <Text style={styles.actionButtonText}>Equip</Text>
                </TouchableOpacity>
              )}
              {selectedItem.type === 'consumable' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.useButton]}
                  onPress={handleUse}
                >
                  <Text style={styles.actionButtonText}>Use</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton]}
                onPress={() => setShowItemModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    padding: 16,
    paddingBottom: 8,
  },
  tabsContainer: {
    maxHeight: 56,
    marginBottom: 8,
  },
  tabsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 14,
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  itemCard: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  itemIconContainer: {
    marginBottom: 4,
  },
  typeIcon: {
    fontSize: 24,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    maxWidth: 320,
    borderWidth: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  modalTypeIcon: {
    fontSize: 28,
  },
  modalItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modalItemType: {
    color: '#64748b',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  modalDescription: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsTitle: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 8,
  },
  statBonus: {
    color: '#4ade80',
    fontSize: 14,
    marginBottom: 2,
  },
  modalButtons: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#22c55e',
  },
  closeButton: {
    backgroundColor: '#334155',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 16,
  },
});
