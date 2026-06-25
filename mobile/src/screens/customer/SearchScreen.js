import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme';
import { useCartStore } from '../../store/store';
import { SearchBar, Chip, DishCard, ChefCard, EmptyState, CartStickyPreview } from '../../components';
import apiClient from '../../config/api';

const CATEGORIES = ['All', 'Spanish', 'Italian', 'Baking', 'Healthy', 'Seafood', 'Desserts'];

export default function SearchScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { addToCart } = useCartStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('dishes'); // 'dishes' | 'chefs'
  const debounceTimer = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      applyFilter();
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [search, category]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dishRes, chefRes] = await Promise.all([
        apiClient.get('/api/customer/dishes'),
        apiClient.get('/api/customer/chefs'),
      ]);
      setDishes(dishRes.data.data || []);
      setChefs(chefRes.data.data || []);
    } catch (error) {
      console.error('Search fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    // filtering is done inline below — no need to re-fetch
  };

  const filteredDishes = dishes.filter((d) => {
    const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.category?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

  const filteredChefs = chefs.filter((c) => {
    const matchSearch = !search || c.users?.name?.toLowerCase().includes(search.toLowerCase()) || c.cuisine_type?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: spacing.containerPaddingMobile, paddingTop: 16 }}>
        <Text style={[styles.pageTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Discover
        </Text>
        <SearchBar
          placeholder="Search dishes, chefs, cuisines..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Tab Switch */}
        <View style={styles.tabRow}>
          <Chip
            label="Dishes"
            active={tab === 'dishes'}
            onPress={() => setTab('dishes')}
            style={{ marginRight: 8 }}
          />
          <Chip
            label="Chefs"
            active={tab === 'chefs'}
            onPress={() => setTab('chefs')}
          />
        </View>

        {/* Category Chips (only for dishes tab) */}
        {tab === 'dishes' && (
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                active={category === cat}
                onPress={() => setCategory(cat)}
                style={styles.chip}
              />
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Searching...
          </Text>
        </View>
      ) : tab === 'dishes' ? (
        filteredDishes.length === 0 ? (
          <EmptyState
            iconName="search"
            title="No Dishes Found"
            description="Try a different search term or category."
            actionTitle="Clear Search"
            onAction={() => { setSearch(''); setCategory('All'); }}
          />
        ) : (
          <FlatList
            data={filteredDishes}
            renderItem={({ item }) => (
              <DishCard
                dish={item}
                onPress={() => {
                  const res = addToCart(item, item.chef_id);
                  if (res?.conflict) {
                    Alert.alert('Different Chef', 'You already have items from another chef. Please clear cart to continue.');
                  } else {
                    Alert.alert('Added!', `${item.name} added to cart`);
                  }
                }}
                onAddPress={() => {
                  const res = addToCart(item, item.chef_id);
                  if (res?.conflict) {
                    Alert.alert('Different Chef', 'You already have items from another chef. Please clear cart to continue.');
                  } else {
                    Alert.alert('Added!', `${item.name} added to cart`);
                  }
                }}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        filteredChefs.length === 0 ? (
          <EmptyState
            iconName="search"
            title="No Chefs Found"
            description="Try a different search term."
            actionTitle="Clear Search"
            onAction={() => setSearch('')}
          />
        ) : (
          <FlatList
            data={filteredChefs}
            renderItem={({ item }) => (
              <ChefCard
                chef={item}
                onPress={() => navigation.navigate('ChefProfile', { chefId: item.user_id, chefName: item.users?.name })}
                style={{ marginHorizontal: spacing.containerPaddingMobile }}
              />
            )}
            keyExtractor={(item) => String(item.user_id)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      )}

      <CartStickyPreview />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  tabRow: { flexDirection: 'row', marginTop: 16, marginBottom: 8 },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
  },
  chip: { marginRight: 8, marginBottom: 8 },
  listContent: { paddingTop: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14 },
});
