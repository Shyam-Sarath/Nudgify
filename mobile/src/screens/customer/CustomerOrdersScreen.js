import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Alert } from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore, useDataStore } from '../../store/store';
import { useTheme } from '../../theme';
import { OrderCard, Skeleton, EmptyState } from '../../components';

export default function CustomerOrdersScreen({ navigation }) {
  const { token } = useAuthStore();
  const { colors, spacing, typography } = useTheme();
  const { orders, setOrders } = useDataStore();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.get('/api/order/customer', { headers });
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          My Orders
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
          title="No Orders Found"
          description="You haven't ordered any meals yet. Browse kitchens to order now."
          actionTitle="Browse Chefs"
          onAction={() => navigation.navigate('Home')}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderTracking', { order: item })}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
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
