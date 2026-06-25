import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, ScrollView, SafeAreaView,
  Pressable, Alert, Animated, Dimensions
} from 'react-native';
import apiClient from '../../config/api';
import { useDataStore, useCartStore, useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { SearchBar, ChefCard, DishCard, Skeleton, CartStickyPreview } from '../../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNERS = [
  { id: 1, title: 'Authentic Home Cooking', subtitle: 'Fresh meals from local chefs', emoji: '🍲', bg: '#334537' },
  { id: 2, title: '25% Off Your First Order', subtitle: 'Use code NUDGE25 at checkout', emoji: '🎉', bg: '#5c3d2e' },
  { id: 3, title: 'New Chefs This Week', subtitle: 'Discover fresh flavours near you', emoji: '👨‍🍳', bg: '#2c4a52' },
];

const CATEGORIES_FALLBACK = ['All'];

export default function CustomerHomeScreen({ navigation }) {
  const { colors, spacing, radius, typography, icons } = useTheme();
  const { chefs, setChefs } = useDataStore();
  const { addToCart, cart } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES_FALLBACK);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bannerIndex, setBannerIndex] = useState(0);

  const bannerScrollRef = useRef(null);
  const bannerTimer = useRef(null);

  useEffect(() => {
    fetchChefs();
    fetchFeaturedDishes();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/api/categories');
      const catNames = (res.data.data || []).map(c => c.name);
      setCategories(['All', ...catNames]);
    } catch (err) {
      console.error('Fetch categories error', err);
    }
  };

  // Auto-scroll banner
  useEffect(() => {
    bannerTimer.current = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerScrollRef.current?.scrollTo({ x: next * (SCREEN_WIDTH - spacing.containerPaddingMobile * 2), animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(bannerTimer.current);
  }, []);

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/customer/chefs');
      setChefs(res.data.data || []);
    } catch (error) {
      console.error('Fetch chefs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedDishes = async () => {
    try {
      const res = await apiClient.get('/api/customer/dishes');
      const allDishes = res.data.data || [];
      setFeaturedDishes(allDishes.slice(0, 10));
    } catch (error) {
      console.error('Fetch featured dishes error:', error);
    }
  };

  const filteredChefs = chefs.filter(
    (c) =>
      c.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.cuisine_type?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDishes = featuredDishes.filter(
    (d) => selectedCategory === 'All' || d.category === selectedCategory
  );

  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getCartTotal = () => cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

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

        {/* Hero Banner Carousel */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile }}>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - spacing.containerPaddingMobile * 2));
              setBannerIndex(idx);
            }}
          >
            {BANNERS.map((banner) => (
              <View
                key={banner.id}
                style={[
                  styles.bannerCard,
                  {
                    backgroundColor: banner.bg,
                    width: SCREEN_WIDTH - spacing.containerPaddingMobile * 2,
                    borderRadius: radius.lg,
                    marginRight: 12,
                  }
                ]}
              >
                <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
                <Text style={[styles.bannerTitle, { fontFamily: typography.fontFamilies.heading }]}>{banner.title}</Text>
                <Text style={[styles.bannerSub, { fontFamily: typography.fontFamilies.primary }]}>{banner.subtitle}</Text>
              </View>
            ))}
          </ScrollView>
          {/* Dot indicators */}
          <View style={styles.dots}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === bannerIndex ? colors.primary : colors.border }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Category Chips */}
        <View style={{ marginTop: spacing.stackLg }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.containerPaddingMobile, gap: 10 }}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === cat ? colors.primary : colors.surfaceContainerLow,
                    borderRadius: radius.full,
                    borderColor: selectedCategory === cat ? colors.primary : colors.border,
                  }
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === cat ? '#ffffff' : colors.text,
                    fontFamily: selectedCategory === cat ? typography.fontFamilies.primaryBold : typography.fontFamilies.primary,
                  }
                ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Chefs Section */}
        <View style={[styles.section, { marginTop: spacing.stackXl }]}>
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
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddPress={() => {
                  const res = addToCart(dish, dish.chef_id);
                  if (res?.conflict) {
                    Alert.alert('Different Chef', 'You already have items from another chef. Please clear cart to continue.');
                  } else {
                    Alert.alert('Added!', `${dish.name} added to cart`);
                  }
                }}
                onPress={() => {
                  const res = addToCart(dish, dish.chef_id);
                  if (res?.conflict) {
                    Alert.alert('Different Chef', 'You already have items from another chef. Please clear cart to continue.');
                  } else {
                    Alert.alert('Added!', `${dish.name} added to cart`);
                  }
                }}
              />
            ))}
            {filteredDishes.length === 0 && (
              <Text style={{ color: colors.mutedText, textAlign: 'center', marginVertical: 20 }}>
                No fresh dishes available for this category.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <CartStickyPreview />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, marginHorizontal: 4 },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    position: 'absolute',
    left: '50%',
    marginLeft: -40,
  },
  notificationBtn: { padding: 6 },
  scrollContent: { paddingBottom: 120 },
  bannerCard: {
    padding: 20,
    height: 130,
    justifyContent: 'center',
  },
  bannerEmoji: { fontSize: 28, marginBottom: 6 },
  bannerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  categoryText: { fontSize: 13 },
  section: { width: '100%' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionSub: { fontSize: 13, marginTop: 2 },
  chefCard: { width: 280, marginRight: 16 },
  dishGrid: { marginTop: 8 },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  cartBadgeText: { color: '#ffffff', fontSize: 14 },
  cartBarText: { color: '#ffffff', fontSize: 15 },
  cartBarTotal: { color: '#ffffff', fontSize: 17 },
});
