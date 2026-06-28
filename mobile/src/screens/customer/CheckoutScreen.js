import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Alert, Pressable, PanResponder, Animated, Dimensions } from 'react-native';
import apiClient from '../../config/api';
import { useCartStore } from '../../store/store';
import { useTheme } from '../../theme';
import { Button, Card, Divider } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CheckoutScreen({ navigation }) {
  const { cart, chefId, clearCart } = useCartStore();
  const { colors, spacing, radius, typography } = useTheme();

  const [address, setAddress] = useState('482 Riverside Drive, Apt 4B, New York, NY 10027');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Slide track variables
  const slideX = useRef(new Animated.Value(0)).current;
  const trackWidth = SCREEN_WIDTH - spacing.containerPaddingMobile * 2;
  const handleWidth = 56;
  const maxSlide = trackWidth - handleWidth - 8;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > maxSlide) newX = maxSlide;
        slideX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= maxSlide * 0.9) {
          // Slide completed!
          Animated.timing(slideX, {
            toValue: maxSlide,
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            handleConfirmOrder();
          });
        } else {
          // Cancel slide, return to start
          Animated.spring(slideX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  };

  const deliveryFee = 4.5;
  const taxFee = 2.75;
  const totalAmount = getSubtotal() + deliveryFee + taxFee;

  const handleConfirmOrder = async () => {
    if (loading) return; // Prevent double submission
    if (cart.length === 0) return;
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      // Reset slider
      Animated.spring(slideX, { toValue: 0, useNativeDriver: false }).start();
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      }));
      const orderPayload = {
        chefId,
        items: orderItems,
        totalAmount,
        deliveryAddress: address,
        specialInstructions: instructions,
      };

      const res = await apiClient.post('/api/order', orderPayload);
      const placedOrder = res.data.data;

      // Navigate to order tracking and pass order details
      clearCart();
      navigation.navigate('OrderTracking', { order: placedOrder });
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Failed', error.response?.data?.message || 'Failed to place order.');
      // Reset slider
      Animated.spring(slideX, { toValue: 0, useNativeDriver: false }).start();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile, borderBottomColor: colors.border + '50' }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18, color: colors.primary }}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Checkout
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile }}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Order Summary
          </Text>
          <Card variant="flat" style={styles.summaryCard}>
            {cart.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Image
                  source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' }}
                  style={[styles.itemImage, { borderRadius: radius.default }]}
                />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemQty, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                    Qty: {item.quantity}
                  </Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Delivery Address */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile, marginTop: spacing.stackLg }}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Delivery Address
          </Text>
          <View style={[styles.addressBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }]}>
            <TextInput
              style={[styles.addressInput, { color: colors.text, fontFamily: typography.fontFamilies.primary }]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter complete delivery address..."
              placeholderTextColor={colors.mutedText}
              multiline
            />
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile, marginTop: spacing.stackMd }}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Delivery Instructions
          </Text>
          <View style={[styles.addressBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }]}>
            <TextInput
              style={[styles.addressInput, { color: colors.text, fontFamily: typography.fontFamilies.primary }]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Leave at door, ring bell, no plastic bags..."
              placeholderTextColor={colors.mutedText}
              multiline
            />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile, marginTop: spacing.stackLg }}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Payment Method
          </Text>
          <View style={styles.paymentsRow}>
            <Pressable
              style={[
                styles.paymentCard,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderRadius: radius.default,
                  borderColor: paymentMethod === 'apple' ? colors.primary : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => setPaymentMethod('apple')}
            >
              <Text style={[styles.paymentText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                 Pay
              </Text>
              {paymentMethod === 'apple' && <Text style={{ color: colors.primary }}>✓</Text>}
            </Pressable>

            <Pressable
              style={[
                styles.paymentCard,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderRadius: radius.default,
                  borderColor: paymentMethod === 'card' ? colors.primary : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={[styles.paymentText, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                Visa •••• 4242
              </Text>
              {paymentMethod === 'card' && <Text style={{ color: colors.primary }}>✓</Text>}
            </Pressable>
          </View>
        </View>

        {/* Billing Breakdown */}
        <View style={{ paddingHorizontal: spacing.containerPaddingMobile, marginTop: spacing.stackLg }}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Billing Details
          </Text>
          <View style={styles.billingRow}>
            <Text style={{ color: colors.mutedText, fontFamily: typography.fontFamilies.primary }}>Subtotal</Text>
            <Text style={{ color: colors.text, fontFamily: typography.fontFamilies.primaryBold }}>${getSubtotal().toFixed(2)}</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={{ color: colors.mutedText, fontFamily: typography.fontFamilies.primary }}>Delivery Fee</Text>
            <Text style={{ color: colors.text, fontFamily: typography.fontFamilies.primaryBold }}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={{ color: colors.mutedText, fontFamily: typography.fontFamilies.primary }}>Service & Taxes</Text>
            <Text style={{ color: colors.text, fontFamily: typography.fontFamilies.primaryBold }}>${taxFee.toFixed(2)}</Text>
          </View>
          <Divider />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Slide to Confirm Button Bar */}
      <View style={[styles.stickyBottomBar, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <View style={[styles.slideTrack, { backgroundColor: colors.surfaceContainer, borderRadius: radius.full }]}>
          <Animated.View
            style={[
              styles.slideProgress,
              {
                width: Animated.add(slideX, handleWidth),
                backgroundColor: colors.primary + '15',
                borderRadius: radius.full,
              },
            ]}
          />
          <View style={styles.slideTextWrapper}>
            <Text style={[styles.slideText, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
              {loading ? 'Processing...' : 'Slide to confirm order'}
            </Text>
          </View>
          <Animated.View
            {...(loading ? {} : panResponder.panHandlers)}
            style={[
              styles.slideHandle,
              {
                transform: [{ translateX: slideX }],
                backgroundColor: colors.primary,
                borderRadius: radius.full,
              },
            ]}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>→</Text>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryCard: {
    padding: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    objectFit: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemQty: {
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  addressBox: {
    padding: 12,
  },
  addressInput: {
    height: 60,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  paymentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 4,
  },
  paymentText: {
    fontSize: 14,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  slideTrack: {
    height: 64,
    position: 'relative',
    justifyContent: 'center',
    padding: 4,
  },
  slideProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  slideTextWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideText: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  slideHandle: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
