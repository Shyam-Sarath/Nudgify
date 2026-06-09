import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useCartStore, useAuthStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function CustomerCartScreen({ navigation }) {
  const { cart, chefId, addToCart, removeFromCart, clearCart } = useCartStore();
  const { token } = useAuthStore();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price),
      }));

      const headers = { Authorization: `Bearer ${token}` };
      const orderPayload = {
        chefId,
        items: orderItems,
        totalAmount: getTotal(),
        deliveryAddress: address, // passing optional address
      };

      let res;
      try {
        res = await axios.post(`${API_URL}/api/order`, orderPayload, { headers });
      } catch {
        res = await axios.post(`${API_URL_WEB}/api/order`, orderPayload, { headers });
      }

      Alert.alert('Success', 'Order placed successfully!');
      clearCart();
      setAddress('');
      navigation.navigate('Orders');
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Failed', error.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item, chefId)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.browseBtnText}>Browse Chefs</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Text style={styles.label}>Delivery Address</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Enter complete delivery address..."
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f5f7',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  itemPrice: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e1e24',
    marginHorizontal: 12,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e1e24',
    marginBottom: 8,
  },
  addressInput: {
    height: 60,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1e1e24',
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 15,
    color: '#666',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  checkoutBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
