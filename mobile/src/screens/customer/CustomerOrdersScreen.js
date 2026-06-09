import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore, useDataStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function CustomerOrdersScreen() {
  const { token } = useAuthStore();
  const { orders, setOrders } = useDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/order/customer`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/order/customer`, { headers });
      }
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      Alert.alert('Error', 'Failed to fetch your orders history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'accepted': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.chefName}>{item.chef_name || 'Chef'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.amountText}>Total Amount: ${parseFloat(item.total_amount).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingText}>Fetching order history...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchOrders}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  chefName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
});
