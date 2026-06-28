import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChefAnalyticsScreen() {
  const { colors, typography } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Analytics Overview
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
          Detailed insights and reporting coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center' },
});
