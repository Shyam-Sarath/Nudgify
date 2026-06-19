import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Pressable } from 'react-native';
import { useCartStore } from '../../store/store';
import { useTheme } from '../../theme';
import { CartItem, Button, EmptyState } from '../../components';

export default function CustomerCartScreen({ navigation }) {
  const { cart, chefId, addToCart, removeFromCart } = useCartStore();
  const { colors, spacing, radius, typography } = useTheme();

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
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
        <View style={{ width: 20 }} />
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

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Subtotal
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
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 15,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  checkoutBtn: {
    width: '100%',
  },
});
