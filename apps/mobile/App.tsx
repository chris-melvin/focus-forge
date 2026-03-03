import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Simple placeholder screens for now
function FocusScreen() {
  const { state } = useGame();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Focus Timer</Text>
      <Text style={styles.text}>Level: {state.character.level}</Text>
      <Text style={styles.text}>XP: {state.character.xp}/{state.character.maxXp}</Text>
      <Text style={styles.text}>Streak: {state.streak} days</Text>
    </View>
  );
}

function CharacterScreen() {
  const { state } = useGame();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Character</Text>
      <Text style={styles.text}>HP: {state.character.hp}/{state.character.maxHp}</Text>
      <Text style={styles.text}>Gold: {state.character.gold}</Text>
      <Text style={styles.text}>Inventory: {state.inventory.length} items</Text>
    </View>
  );
}

function HallScreen() {
  const { state } = useGame();
  const unlockedRooms = state.hall.filter(r => state.totalFocusHours >= r.unlockHours);
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Focus Hall</Text>
      <Text style={styles.text}>Unlocked Rooms: {unlockedRooms.length}/{state.hall.length}</Text>
      <Text style={styles.text}>Total Focus: {Math.floor(state.totalFocusHours)}h</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function AppContent() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: { backgroundColor: '#111827' },
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#fff',
        }}
      >
        <Tab.Screen
          name="Focus"
          component={FocusScreen}
          options={{ tabBarIcon: () => <Text>🎯</Text> }}
        />
        <Tab.Screen
          name="Character"
          component={CharacterScreen}
          options={{ tabBarIcon: () => <Text>🧙</Text> }}
        />
        <Tab.Screen
          name="Hall"
          component={HallScreen}
          options={{ tabBarIcon: () => <Text>🏰</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GameProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <AppContent />
      </SafeAreaView>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 10,
  },
});
