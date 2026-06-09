import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChefDashboardScreen from '../screens/chef/ChefDashboardScreen';
import ChefMenuScreen from '../screens/chef/ChefMenuScreen';
import ChefOrdersScreen from '../screens/chef/ChefOrdersScreen';
import ChefProfileScreen from '../screens/chef/ChefProfileScreen';

const Tab = createBottomTabNavigator();

export default function ChefNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Dashboard') icon = '📊';
          else if (route.name === 'Menu') icon = '🍳';
          else if (route.name === 'Orders') icon = '📦';
          else if (route.name === 'Profile') icon = '👤';
          return icon;
        },
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#1e1e24',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={ChefDashboardScreen} options={{ title: 'Chef Analytics' }} />
      <Tab.Screen name="Menu" component={ChefMenuScreen} options={{ title: 'Menu Directory' }} />
      <Tab.Screen name="Orders" component={ChefOrdersScreen} options={{ title: 'Customer Orders' }} />
      <Tab.Screen name="Profile" component={ChefProfileScreen} options={{ title: 'Chef Profile' }} />
    </Tab.Navigator>
  );
}
