import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { GameProvider } from './src/context/GameContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FocusTimer from './src/components/FocusTimer';
import CharacterPanel from './src/components/CharacterPanel';
import HallPanel from './src/components/HallPanel';
import Inventory from './src/components/Inventory';

const Tab = createBottomTabNavigator();

function AppContent() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: { 
            backgroundColor: '#111827',
            borderTopColor: '#1e293b',
            borderTopWidth: 1,
          },
          headerStyle: { 
            backgroundColor: '#111827',
            borderBottomColor: '#1e293b',
            borderBottomWidth: 1,
          },
          headerTintColor: '#fff',
        }}
      >
        <Tab.Screen
          name="Focus"
          component={FocusTimer}
          options={{ 
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎯</Text>,
            headerTitle: 'Focus Forge',
          }}
        />
        <Tab.Screen
          name="Character"
          component={CharacterPanel}
          options={{ 
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🧙‍♂️</Text>,
            headerTitle: 'Character',
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={Inventory}
          options={{ 
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎒</Text>,
            headerTitle: 'Inventory',
          }}
        />
        <Tab.Screen
          name="Hall"
          component={HallPanel}
          options={{ 
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏰</Text>,
            headerTitle: 'Focus Hall',
          }}
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
});
