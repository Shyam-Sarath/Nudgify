import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChefDashboardScreen from '../screens/chef/ChefDashboardScreen';
import ChefMenuScreen from '../screens/chef/ChefMenuScreen';
import ChefOrdersScreen from '../screens/chef/ChefOrdersScreen';
import ChefProfileScreen from '../screens/chef/ChefProfileScreen';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator();

export default function ChefNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator id="chef"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Dashboard') icon = '📊';
          else if (route.name === 'Menu') icon = '🍳';
          else if (route.name === 'Orders') icon = '📦';
          else if (route.name === 'Profile') icon = '👤';
          return icon;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
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
