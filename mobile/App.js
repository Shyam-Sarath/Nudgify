import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useAuthStore } from './src/store/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import ChefNavigator from './src/navigation/ChefNavigator';
import { ThemeProvider } from './src/theme';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Manrope-SemiBold': Manrope_600SemiBold,
    'Manrope-Bold': Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcf9f8' }}>
        <ActivityIndicator size="large" color="#334537" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
