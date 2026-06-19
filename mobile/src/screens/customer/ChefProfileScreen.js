import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, Pressable, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore, useCartStore } from '../../store/store';
import { useTheme } from '../../theme';
import { DishCard, MenuSection, Button } from '../../components';

export default function ChefProfileScreen({ route, navigation }) {
  const { chefId, chefName } = route.params;
  const { token } = useAuthStore();
  const { cart, addToCart } = useCartStore();
  const { colors, spacing, radius, typography } = useTheme();
  
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchChefDetails();
  }, [chefId]);

  const fetchChefDetails = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.get(`/api/customer/chefs/${chefId}`, { headers });
      setChef(res.data.data);
      setDishes(res.data.data.dishes || []);
    } catch (error) {
      console.error('Fetch chef details error:', error);
      Alert.alert('Error', 'Failed to fetch chef profile');
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  };

  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Vegetarian') return dish.description?.toLowerCase().includes('veg') || dish.name?.toLowerCase().includes('veg');
    if (selectedCategory === 'Specials') return dish.price > 15; // mock category logic
    return true;
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const profileImage =
    chef?.profile_image ||
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Photo Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: profileImage }} style={styles.heroImage} />
          <View style={styles.heroGradient} />
          
          {/* Custom Header Navigation Overlay */}
          <View style={[styles.headerOverlay, { paddingHorizontal: spacing.containerPaddingMobile }]}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={[styles.backBtn, { backgroundColor: 'rgba(252, 249, 248, 0.8)' }]}
            >
              <Text style={{ fontSize: 18, color: colors.primary }}>←</Text>
            </Pressable>
          </View>

          <View style={[styles.heroInfo, { paddingHorizontal: spacing.containerPaddingMobile }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.favoriteBadge, { backgroundColor: colors.secondaryContainer }]}>
                <Text style={[styles.badgeText, { color: colors.onSecondaryContainer, fontFamily: typography.fontFamilies.primaryBold }]}>
                  Community Favorite
                </Text>
              </View>
              <Text style={[styles.ratingText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>
                ★ {chef?.rating?.toFixed(1) || '4.9'} (124 reviews)
              </Text>
            </View>
            <Text style={[styles.chefName, { color: '#ffffff', fontFamily: typography.fontFamilies.heading }]}>
              Chef {chef?.users?.name || chefName}
            </Text>
            <Text style={[styles.chefTagline, { color: 'rgba(255,255,255,0.9)', fontFamily: typography.fontFamilies.primary }]}>
              {chef?.cuisine_type || 'Heritage'} Cuisine • Fresh local farm sourcing
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.aboutSection, { paddingHorizontal: spacing.containerPaddingMobile }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            About the Chef
          </Text>
          <Text style={[styles.bioText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            {chef?.bio || "Elena's journey began in her grandmother's kitchen in Seville, where she learned that the best meals aren't just about technique, but about the soil and the season."}
          </Text>
          
          <View style={styles.statsRow}>
            <View>
              <Text style={[styles.statLabel, { color: colors.outline, fontFamily: typography.fontFamilies.primary }]}>
                Experience
              </Text>
              <Text style={[styles.statValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                15+ Years
              </Text>
            </View>
            <View style={{ marginLeft: spacing.stackLg * 1.5 }}>
              <Text style={[styles.statLabel, { color: colors.outline, fontFamily: typography.fontFamilies.primary }]}>
                Provenance
              </Text>
              <Text style={[styles.statValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                Local & Organic
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile }}>
          <MenuSection
            title="Menu"
            categories={['All', 'Vegetarian', 'Specials']}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Dish Grid */}
          <View style={styles.dishList}>
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddPress={() => {
                  addToCart(dish, chefId);
                  Alert.alert('Added', `${dish.name} added to cart!`);
                }}
                onPress={() => {
                  addToCart(dish, chefId);
                  Alert.alert('Added', `${dish.name} added to cart!`);
                }}
              />
            ))}
            {filteredDishes.length === 0 && (
              <Text style={[styles.emptyMenu, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                No dishes found under this category
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      {getCartCount() > 0 && (
        <View style={[styles.stickyCartContainer, { paddingHorizontal: spacing.containerPaddingMobile }]}>
          <Pressable
            style={[styles.cartCta, { backgroundColor: colors.secondary, borderRadius: radius.full }]}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={styles.cartCtaLeft}>
              <Text style={[styles.cartCtaLabel, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>
                View Cart
              </Text>
            </View>
            <View style={[styles.cartBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Text style={[styles.cartBadgeText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>
                {getCartCount()} Items • ${getCartTotal().toFixed(2)}
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: 380,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(51, 69, 55, 0.4)',
  },
  headerOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroInfo: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  ratingText: {
    fontSize: 12,
  },
  chefName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  chefTagline: {
    fontSize: 14,
  },
  aboutSection: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
  },
  dishList: {
    marginTop: 16,
  },
  emptyMenu: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
  stickyCartContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  cartCta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cartCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCtaLabel: {
    fontSize: 15,
  },
  cartBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cartBadgeText: {
    fontSize: 12,
  },
});
