import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/store';
import { useTheme } from '../../theme';

export default function CartStickyPreview() {
  const navigation = useNavigation();
  const { cart } = useCartStore();
  const { colors, typography, radius, spacing } = useTheme();
  const slideAnim = useRef(new Animated.Value(100)).current;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  useEffect(() => {
    if (cartCount > 0) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }], paddingHorizontal: spacing.containerPaddingMobile }]}>
      <Pressable
        style={[styles.cartBar, { backgroundColor: colors.primary, borderRadius: radius.full }]}
        onPress={() => navigation.navigate('Cart')}
      >
        <View style={styles.cartBarLeft}>
          <View style={[styles.cartBadge, { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.sm }]}>
            <Text style={[styles.cartBadgeText, { fontFamily: typography.fontFamilies.heading }]}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </Text>
          </View>
          <Text style={[styles.cartBarText, { fontFamily: typography.fontFamilies.primaryBold }]}>
            | ${cartTotal.toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.cartBarTotal, { fontFamily: typography.fontFamilies.heading }]}>
          View Cart →
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  cartBar: {
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
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  cartBadgeText: {
    fontSize: 14,
    color: '#ffffff',
  },
  cartBarText: {
    fontSize: 15,
    color: '#ffffff',
  },
  cartBarTotal: {
    fontSize: 15,
    color: '#ffffff',
  },
});
