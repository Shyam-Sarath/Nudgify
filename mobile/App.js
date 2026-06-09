import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from './src/store/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import ChefNavigator from './src/navigation/ChefNavigator';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'chef' ? (
        <ChefNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
}
