import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import apiClient from '../../config/api';
import { useDataStore, useCartStore, useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { SearchBar, ChefCard, DishCard, Badge, Skeleton, EmptyState } from '../../components';

export default function CustomerHomeScreen({ navigation }) {
  const { token } = useAuthStore();
  const { colors, spacing, radius, typography, icons } = useTheme();
  const { chefs, setChefs } = useDataStore();
  const { addToCart, cart } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [featuredDishes, setFeaturedDishes] = useState([]);

  useEffect(() => {
    fetchChefs();
    fetchFeaturedDishes();
  }, []);

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.get('/api/customer/chefs', { headers });
      setChefs(res.data.data || []);
    } catch (error) {
      console.error('Fetch chefs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedDishes = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Gather dishes from all chefs or call customer menu
      const res = await apiClient.get('/api/customer/chefs', { headers });
      const allChefs = res.data.data || [];
      
      let gatheredDishes = [];
      for (const chef of allChefs) {
        if (chef.user_id) {
          const detailRes = await apiClient.get(`/api/customer/chefs/${chef.user_id}`, { headers });
          const chefDishes = detailRes.data.data.dishes || [];
          // Add chef name context to dishes
          chefDishes.forEach(d => {
            d.chef_name = chef.users?.name;
            d.chef_id = chef.user_id;
          });
          gatheredDishes = [...gatheredDishes, ...chefDishes];
        }
      }
      setFeaturedDishes(gatheredDishes.slice(0, 10)); // Top 10 dishes
    } catch (error) {
      console.error('Fetch featured dishes error:', error);
    }
  };

  const filteredChefs = chefs.filter(
    (c) =>
      c.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.cuisine_type?.toLowerCase().includes(search.toLowerCase())
  );

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const LocationIcon = icons.location;
  const ExpandMoreIcon = icons.expandMore;
  const NotificationIcon = icons.notifications;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top AppBar */}
      <View style={[styles.appBar, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <View style={styles.locationContainer}>
          <LocationIcon size={18} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
            San Francisco, CA
          </Text>
          <ExpandMoreIcon size={16} color={colors.mutedText} />
        </View>

        <Text style={[styles.logo, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Nudgify
        </Text>

        <Pressable onPress={() => navigation.navigate('Notifications')} style={styles.notificationBtn}>
          <NotificationIcon size={20} color={colors.mutedText} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile, marginVertical: spacing.stackLg }}>
          <SearchBar
            placeholder="Search for chefs or cuisines..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Featured Chefs Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: spacing.containerPaddingMobile }]}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
                Featured Chefs
              </Text>
              <Text style={[styles.sectionSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                The masters behind the kitchen
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={{ paddingHorizontal: spacing.containerPaddingMobile, flexDirection: 'row' }}>
              <Skeleton width={260} height={200} style={{ marginRight: 16 }} />
              <Skeleton width={100} height={200} />
            </View>
          ) : filteredChefs.length === 0 ? (
            <View style={{ paddingHorizontal: spacing.containerPaddingMobile }}>
              <Text style={{ color: colors.mutedText }}>No chefs found matching your criteria</Text>
            </View>
          ) : (
            <FlatList
              horizontal
              data={filteredChefs}
              renderItem={({ item }) => (
                <ChefCard
                  chef={item}
                  onPress={() => navigation.navigate('ChefProfile', { chefId: item.user_id, chefName: item.users?.name })}
                  style={styles.chefCard}
                />
              )}
              keyExtractor={(item) => String(item.user_id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.containerPaddingMobile }}
            />
          )}
        </View>

        {/* Fresh from Local Kitchens Section */}
        <View style={[styles.section, { marginTop: spacing.stackXl, paddingHorizontal: spacing.containerPaddingMobile }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
                Fresh from Local Kitchens
              </Text>
              <Text style={[styles.sectionSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Handcrafted meals ready for you
              </Text>
            </View>
          </View>

          <View style={styles.dishGrid}>
            {featuredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddPress={() => {
                  addToCart(dish, dish.chef_id);
                  Alert.alert('Success', `${dish.name} added to cart!`);
                }}
                onPress={() => {
                  addToCart(dish, dish.chef_id);
                  Alert.alert('Success', `${dish.name} added to cart!`);
                }}
              />
            ))}
            {featuredDishes.length === 0 && (
              <Text style={{ color: colors.mutedText, textAlign: 'center', marginVertical: 20 }}>
                No fresh dishes available today.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating View Cart Button if cart is not empty */}
      {getCartCount() > 0 && (
        <Pressable
          style={[styles.fabCart, { backgroundColor: colors.secondary, borderRadius: radius.full }]}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={{ fontSize: 20, color: '#ffffff', marginRight: 6 }}>🛒</Text>
          <Text style={[styles.fabCartText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>
            {getCartCount()}
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    marginHorizontal: 4,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    position: 'absolute',
    left: '50%',
    marginLeft: -40, // center offset estimation
  },
  notificationBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSub: {
    fontSize: 13,
    marginTop: 2,
  },
  chefCard: {
    width: 280,
    marginRight: 16,
  },
  dishGrid: {
    marginTop: 8,
  },
  fabCart: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 99,
  },
  fabCartText: {
    fontSize: 14,
  },
});
