import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet, Text, View, FlatList, SafeAreaView,
  Alert, Pressable
} from 'react-native';
import apiClient from '../../config/api';
import { useDataStore } from '../../store/store';
import { useTheme } from '../../theme';
import { OrderCard, Skeleton, EmptyState } from '../../components';

const STATUS_TABS = ['All', 'Pending', 'Preparing', 'Ready', 'Completed'];

export default function CustomerOrdersScreen({ navigation }) {
  const { colors, spacing, typography, radius } = useTheme();
  const { orders, setOrders } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/order/customer');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'All') return true;
    const statusMap = { Preparing: 'accepted' };
    const mapped = statusMap[activeTab] || activeTab.toLowerCase();
    return o.status?.toLowerCase() === mapped;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <View>
          <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            My Orders
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </Text>
        </View>
      </View>

      {/* Status Filter Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          data={STATUS_TABS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.containerPaddingMobile, gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveTab(item)}
              style={[
                styles.tabChip,
                {
                  backgroundColor: activeTab === item ? colors.primary : colors.surfaceContainerLow,
                  borderRadius: radius.full,
                }
              ]}
            >
              <Text style={[
                styles.tabChipText,
                {
                  color: activeTab === item ? '#ffffff' : colors.mutedText,
                  fontFamily: activeTab === item ? typography.fontFamilies.primaryBold : typography.fontFamilies.primary,
                }
              ]}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {loading ? (
        <View style={[styles.skeletonContainer, { paddingHorizontal: spacing.containerPaddingMobile }]}>
          <Skeleton height={150} style={{ marginBottom: 16 }} />
          <Skeleton height={150} style={{ marginBottom: 16 }} />
          <Skeleton height={150} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          iconName="basket"
          title={activeTab === 'All' ? 'No Orders Yet' : `No ${activeTab} Orders`}
          description={
            activeTab === 'All'
              ? "You haven't ordered any meals yet. Browse kitchens to order your first homemade meal!"
              : `You don't have any ${activeTab.toLowerCase()} orders.`
          }
          actionTitle="Browse Chefs"
          onAction={() => navigation.navigate('Home')}
        />
      ) : (
        <FlatList
          data={filteredOrders}
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
  container: { flex: 1 },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  tabsContainer: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  tabChipText: { fontSize: 13 },
  skeletonContainer: { paddingTop: 20 },
  listContent: { paddingTop: 16, paddingBottom: 40 },
});
