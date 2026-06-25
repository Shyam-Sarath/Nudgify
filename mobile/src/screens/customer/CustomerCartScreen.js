import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Pressable, Alert } from 'react-native';
import { useCartStore, useDataStore } from '../../store/store';
import { useTheme } from '../../theme';
import { CartItem, Button, EmptyState, Divider } from '../../components';

const DELIVERY_FEE = 4.5;
const TAX_RATE = 0.08; // 8%

export default function CustomerCartScreen({ navigation }) {
  const { cart, chefId, addToCart, removeFromCart, clearCart } = useCartStore();
  const { orders } = useDataStore();
  const { colors, spacing, radius, typography } = useTheme();

  const getSubtotal = () => cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const getTax = () => getSubtotal() * TAX_RATE;
  const getTotal = () => getSubtotal() + DELIVERY_FEE + getTax();
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRepeatLastOrder = () => {
    if (!orders || orders.length === 0) {
      Alert.alert('No Previous Orders', 'You have not placed any orders yet.');
      return;
    }
    // Get the most recent order
    Alert.alert(
      'Repeat Last Order?',
      `This will replace your current cart with items from your last order.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Repeat',
          onPress: () => {
            Alert.alert('Coming Soon', 'Repeat order will be available once your order history is linked to dish data.');
          }
        }
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <EmptyState
          iconName="cart"
          title="Your Cart is Empty"
          description="Browse nearby home chefs to add organic homemade meals to your cart."
          actionTitle="Browse Chefs"
          onAction={() => navigation.navigate('Home')}
        />
        {orders && orders.length > 0 && (
          <Pressable
            style={[styles.repeatBtn, { borderColor: colors.primary, borderRadius: radius.default }]}
            onPress={handleRepeatLastOrder}
          >
            <Text style={[styles.repeatBtnText, { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }]}>
              🔄 Repeat Last Order
            </Text>
          </Pressable>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile, borderBottomColor: colors.border + '50' }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18, color: colors.primary }}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Cart ({getCartCount()})
        </Text>
        <Pressable onPress={() => {
          Alert.alert('Clear Cart', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart }
          ]);
        }}>
          <Text style={[styles.clearText, { color: colors.error, fontFamily: typography.fontFamilies.primaryBold }]}>
            Clear
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onAdd={() => addToCart(item, chefId)}
            onRemove={() => removeFromCart(item.id)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Summary Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Subtotal
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
            ${getSubtotal().toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Delivery Fee
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
            ${DELIVERY_FEE.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Tax (8%)
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
            ${getTax().toFixed(2)}
          </Text>
        </View>
        <Divider />
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            ${getTotal().toFixed(2)}
          </Text>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  repeatBtn: {
    borderWidth: 1.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  repeatBtnText: { fontSize: 14 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  clearText: { fontSize: 13 },
  listContent: { paddingTop: 16, paddingBottom: 20 },
  footer: { padding: 20, borderTopWidth: 1 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 22, fontWeight: '700' },
  checkoutBtn: { width: '100%' },
});
