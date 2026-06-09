import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore, useDataStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function ChefOrdersScreen() {
  const { token } = useAuthStore();
  const { orders, setOrders } = useDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefOrders();
  }, []);

  const fetchChefOrders = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/order/chef`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/order/chef`, { headers });
      }
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Fetch chef orders error:', error);
      Alert.alert('Error', 'Failed to fetch incoming orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, action) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.put(`${API_URL}/api/chef/orders/${orderId}/${action}`, {}, { headers });
      } catch {
        res = await axios.put(`${API_URL_WEB}/api/chef/orders/${orderId}/${action}`, {}, { headers });
      }
      Alert.alert('Success', `Order status updated to: ${action}ed`);
      fetchChefOrders();
    } catch (error) {
      console.error('Update order status error:', error);
      Alert.alert('Error', 'Failed to update order status');
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
        <Text style={styles.orderId}>Order #{String(item.id).padStart(5, '0')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <Text style={styles.customerName}>Customer: {item.customer_name || 'Guest'}</Text>
        <Text style={styles.amountText}>Amount: ${parseFloat(item.total_amount).toFixed(2)}</Text>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {item.status === 'pending' && (
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleUpdateStatus(item.id, 'reject')}
          >
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleUpdateStatus(item.id, 'accept')}
          >
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'accepted' && (
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => handleUpdateStatus(item.id, 'complete')}
        >
          <Text style={styles.completeBtnText}>Mark Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingText}>Fetching incoming orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No incoming orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchChefOrders}
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
  orderId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e24',
    fontFamily: 'System',
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
    marginTop: 12,
  },
  customerName: {
    fontSize: 14,
    color: '#1e1e24',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  rejectBtn: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  rejectBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: 'bold',
  },
  acceptBtn: {
    backgroundColor: '#ff6b35',
  },
  acceptBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  completeBtn: {
    width: '100%',
    height: 42,
    backgroundColor: '#10b981',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
