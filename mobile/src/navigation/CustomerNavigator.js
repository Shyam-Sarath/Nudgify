import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CustomerCartScreen from '../screens/customer/CustomerCartScreen';
import CustomerOrdersScreen from '../screens/customer/CustomerOrdersScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';

const Tab = createBottomTabNavigator();

export default function CustomerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Home') icon = '🏠';
          else if (route.name === 'Cart') icon = '🛒';
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
      <Tab.Screen name="Home" component={CustomerHomeScreen} options={{ title: 'Chefs Directory' }} />
      <Tab.Screen name="Cart" component={CustomerCartScreen} options={{ title: 'My Shopping Cart' }} />
      <Tab.Screen name="Orders" component={CustomerOrdersScreen} options={{ title: 'My Orders' }} />
      <Tab.Screen name="Profile" component={CustomerProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
}
