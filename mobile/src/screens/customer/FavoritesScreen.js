import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '../../theme';
import { DishCard } from '../../components';

export default function FavoritesScreen() {
  const { colors, spacing, typography } = useTheme();

  const mockFavorites = [
    { id: 101, name: 'Saffron Seafood Paella', price: 24.0, prep_time: '25-35 min', calories: 480, image_url: 'https://images.unsplash.com/photo-1534080391025-347b4c98a0f7?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Favorites
        </Text>
      </View>

      <FlatList
        data={mockFavorites}
        renderItem={({ item }) => <DishCard dish={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});
