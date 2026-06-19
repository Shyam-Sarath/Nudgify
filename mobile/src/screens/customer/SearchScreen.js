import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Alert } from 'react-native';
import { useTheme } from '../../theme';
import { SearchBar, Chip, DishCard } from '../../components';

export default function SearchScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Mock search results
  const mockDishes = [
    { id: 101, name: 'Saffron Seafood Paella', price: 24.0, prep_time: '25-35 min', calories: 480, image_url: 'https://images.unsplash.com/photo-1534080391025-347b4c98a0f7?auto=format&fit=crop&w=300&q=80' },
    { id: 102, name: 'Truffle Pappardelle Pasta', price: 18.0, prep_time: '15-20 min', calories: 520, image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: spacing.containerPaddingMobile, paddingTop: 16 }}>
        <SearchBar
          placeholder="Search chefs, kitchens, or cuisines..."
          value={search}
          onChangeText={setSearch}
        />
        
        <View style={styles.categoriesRow}>
          {['All', 'Spanish', 'Italian', 'Baking', 'Healthy'].map((cat) => (
            <Chip
              key={cat}
              label={cat}
              active={category === cat}
              onPress={() => setCategory(cat)}
              style={styles.chip}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={mockDishes}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onPress={() => {
              Alert.alert('Details', 'Opening dish details bottom sheet...');
            }}
          />
        )}
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
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});
