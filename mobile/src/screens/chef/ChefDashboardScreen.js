import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, Alert, Image } from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { StatCard, OrderCard, Card, Skeleton } from '../../components';

export default function ChefDashboardScreen({ navigation }) {
  const { token, user } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();
  
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, completedOrders: 0 });
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch stats
      const statsRes = await apiClient.get('/api/chef/dashboard', { headers });
      setStats(statsRes.data.data || { totalOrders: 0, totalRevenue: 0, completedOrders: 0 });

      // Fetch live orders
      const ordersRes = await apiClient.get('/api/order/chef', { headers });
      const allOrders = ordersRes.data.data || [];
      // Filter for active orders (pending, preparing/accepted, ready)
      const active = allOrders.filter(
        (o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'ready'
      );
      setLiveOrders(active);
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, action) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await apiClient.put(`/api/chef/orders/${orderId}/${action}`, {}, { headers });
      Alert.alert('Success', `Order status updated to: ${action}ed`);
      fetchDashboardData();
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update order');
    }
  };

  const getPendingCount = () => {
    return liveOrders.filter((o) => o.status === 'pending').length;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile }]}>
        <View style={styles.headerLeft || {}}>
          <Text style={[styles.logo, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Nudgify
          </Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80' }}
          style={[styles.avatar, { borderRadius: radius.full }]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} colors={[colors.primary]} />
        }
      >
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeSubtitle, { color: colors.secondary, fontFamily: typography.fontFamilies.primaryBold }]}>
            GOOD MORNING, CHEF {user?.name?.toUpperCase() || 'JULIAN'}
          </Text>
          <Text style={[styles.welcomeTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Your kitchen is thriving today.
          </Text>
        </View>

        {/* Bento stats grid */}
        <View style={styles.grid}>
          <View style={styles.gridColumn}>
            <StatCard
              title="Today's Earnings"
              value={`$${Number(stats.totalRevenue || 0).toFixed(2)}`}
              iconName="earnings"
              trend="12% from yesterday"
              trendUp={true}
              style={{ marginBottom: 16 }}
            />
            <StatCard
              title="New Orders"
              value={getPendingCount() < 10 ? `0${getPendingCount()}` : getPendingCount()}
              iconName="restaurant"
              trend="Awaiting prep"
              trendUp={true}
            />
          </View>
          <View style={[styles.gridColumn, { marginLeft: 16 }]}>
            <StatCard
              title="Rating"
              value="4.9"
              iconName="rating"
              trend="240 reviews"
              trendUp={true}
              style={{ height: '100%' }}
            />
          </View>
        </View>

        {/* Live Orders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Live Orders
          </Text>
          {loading ? (
            <Skeleton height={120} style={{ marginBottom: 12 }} />
          ) : liveOrders.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                No active orders at the moment.
              </Text>
            </Card>
          ) : (
            liveOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={{
                  ...order,
                  status: order.status === 'accepted' ? 'preparing' : order.status,
                }}
                isChef
                onAccept={() => handleUpdateStatus(order.id, 'accept')}
                onDecline={() => handleUpdateStatus(order.id, 'reject')}
                onMarkReady={() => handleUpdateStatus(order.id, 'complete')}
              />
            ))
          )}
        </View>

        {/* Weekly performance chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Weekly Performance
          </Text>
          <Card variant="flat" style={StyleSheet.flatten([styles.performanceCard, { backgroundColor: colors.primary }])}>
            <View style={styles.perfHeader}>
              <Text style={[styles.perfLabel, { color: 'rgba(255,255,255,0.7)', fontFamily: typography.fontFamilies.primary }]}>
                Weekly Revenue
              </Text>
              <Text style={[styles.perfAmount, { color: '#ffffff', fontFamily: typography.fontFamilies.heading }]}>
                ${(Number(stats.totalRevenue || 0) * 4.2).toFixed(2)}
              </Text>
            </View>

            {/* Simple simulated bar chart */}
            <View style={styles.chart}>
              {[
                { day: 'Mon', h: 60 },
                { day: 'Tue', h: 45 },
                { day: 'Wed', h: 85 },
                { day: 'Thu', h: 70 },
                { day: 'Fri', h: 95 },
                { day: 'Sat', h: 100, active: true },
                { day: 'Sun', h: 30 },
              ].map((b, i) => (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.barTrack}>
                    <View style={[
                      styles.barFill,
                      {
                        height: (b.h / 100) * 70,
                        backgroundColor: b.active ? colors.secondary : 'rgba(255,255,255,0.2)'
                      }
                    ]} />
                  </View>
                  <Text style={[styles.chartDay, { color: b.active ? '#ffffff' : 'rgba(255,255,255,0.6)', fontFamily: typography.fontFamilies.primary }]}>
                    {b.day}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {},

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
  },
  avatar: {
    width: 36,
    height: 36,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeSubtitle: {
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridColumn: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  performanceCard: {
    padding: 20,
    minHeight: 220,
  },
  perfHeader: {
    marginBottom: 20,
  },
  perfLabel: {
    fontSize: 12,
  },
  perfAmount: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 70,
    width: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  chartDay: {
    fontSize: 10,
    marginTop: 6,
  },
});
