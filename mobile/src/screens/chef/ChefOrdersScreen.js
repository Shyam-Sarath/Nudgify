import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore, useDataStore } from '../../store/store';
import { useTheme } from '../../theme';
import { OrderCard, Skeleton, EmptyState } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChefOrdersScreen() {
  const { colors, spacing, typography } = useTheme();
  const { orders, setOrders } = useDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefOrders();
  }, []);

  const fetchChefOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/order/chef');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Fetch chef orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, action) => {
    try {
      await apiClient.put(`/api/chef/orders/${orderId}/${action}`, {});
      Alert.alert('Success', `Order status updated to: ${action}ed`);
      fetchChefOrders();
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Customer Orders
        </Text>
      </View>

      {loading ? (
        <View style={[styles.skeletonContainer, { paddingHorizontal: spacing.containerPaddingMobile }]}>
          <Skeleton height={140} style={{ marginBottom: 16 }} />
          <Skeleton height={140} style={{ marginBottom: 16 }} />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          iconName="basket"
          title="No Incoming Orders"
          description="You don't have any customer orders yet. When customers order, they'll show up here!"
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderCard
              order={{
                ...item,
                status: item.status === 'accepted' ? 'preparing' : item.status,
              }}
              isChef
              onAccept={() => handleUpdateStatus(item.id, 'accept')}
              onDecline={() => handleUpdateStatus(item.id, 'reject')}
              onMarkReady={() => handleUpdateStatus(item.id, 'complete')}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
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
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  skeletonContainer: {
    paddingTop: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});
