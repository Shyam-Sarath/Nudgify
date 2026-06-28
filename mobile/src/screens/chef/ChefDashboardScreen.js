import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet, Text, View, ScrollView,
  RefreshControl, Alert, Image, Pressable, Animated,
} from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';
import { OrderCard, Card, Skeleton } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUS_PIPELINE = [
  { key: 'pending',   label: 'Pending',   emoji: '🕐' },
  { key: 'accepted',  label: 'Preparing', emoji: '🍳' },
  { key: 'ready',     label: 'Ready',     emoji: '✅' },
  { key: 'completed', label: 'Done',      emoji: '🎉' },
];

export default function ChefDashboardScreen({ navigation }) {
  const { user } = useAuthStore();
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
      const [statsRes, ordersRes] = await Promise.all([
        apiClient.get('/api/chef/dashboard'),
        apiClient.get('/api/order/chef'),
      ]);
      setStats(statsRes.data.data || { totalOrders: 0, totalRevenue: 0, completedOrders: 0 });
      const allOrders = ordersRes.data.data || [];
      const active = allOrders.filter(
        (o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'ready'
      );
      setLiveOrders(active);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, action) => {
    try {
      await apiClient.put(`/api/chef/orders/${orderId}/${action}`, {});
      fetchDashboardData();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update order');
    }
  };

  const pendingCount = liveOrders.filter((o) => o.status === 'pending').length;
  const preparingCount = liveOrders.filter((o) => o.status === 'accepted').length;
  const readyCount = liveOrders.filter((o) => o.status === 'ready').length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header */}
      <View style={[styles.header, { backgroundColor: colors.primary, paddingHorizontal: spacing.containerPaddingMobile }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { fontFamily: typography.fontFamilies.primary, color: 'rgba(255,255,255,0.75)' }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.chefName, { fontFamily: typography.fontFamilies.heading, color: '#ffffff' }]}>
              Chef {user?.name?.split(' ')[0] || 'Julian'} 👋
            </Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80' }}
            style={[styles.avatar, { borderRadius: radius.full, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }]}
          />
        </View>

        {/* Quick revenue pill */}
        <View style={[styles.revenuePill, { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.full }]}>
          <Text style={[styles.revenuePillLabel, { fontFamily: typography.fontFamilies.primary, color: 'rgba(255,255,255,0.75)' }]}>
            Total Revenue
          </Text>
          <Text style={[styles.revenuePillValue, { fontFamily: typography.fontFamilies.heading, color: '#ffffff' }]}>
            ${Number(stats.totalRevenue || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} colors={[colors.primary]} />
        }
      >
        {/* Pending Alert Banner */}
        {pendingCount > 0 && (
          <View style={[styles.alertBanner, {
            backgroundColor: '#FF6B3520',
            borderColor: '#FF6B35',
            borderRadius: radius.default,
          }]}>
            <Text style={styles.alertEmoji}>🔔</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: '#FF6B35', fontFamily: typography.fontFamilies.primaryBold }]}>
                {pendingCount} New Order{pendingCount > 1 ? 's' : ''} Waiting!
              </Text>
              <Text style={[styles.alertSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Customers are hungry — accept and start cooking.
              </Text>
            </View>
          </View>
        )}

        {/* Order Status Pipeline */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Order Pipeline
          </Text>
          <View style={styles.pipeline}>
            {[
              { label: 'Pending', count: pendingCount, emoji: '🕐', color: '#FF6B35' },
              { label: 'Cooking', count: preparingCount, emoji: '🍳', color: '#F59E0B' },
              { label: 'Ready', count: readyCount, emoji: '✅', color: '#10B981' },
              { label: 'Done', count: stats.completedOrders || 0, emoji: '🎉', color: colors.primary },
            ].map((step) => (
              <View key={step.label} style={[styles.pipelineCard, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }]}>
                <Text style={styles.pipelineEmoji}>{step.emoji}</Text>
                <Text style={[styles.pipelineCount, { color: step.color, fontFamily: typography.fontFamilies.heading }]}>
                  {step.count < 10 ? `0${step.count}` : step.count}
                </Text>
                <Text style={[styles.pipelineLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Revenue Stats Row */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Performance
          </Text>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }]}>
              <Text style={[styles.statEmoji]}>📦</Text>
              <Text style={[styles.statValue, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
                {stats.totalOrders || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Total Orders
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }]}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={[styles.statValue, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
                4.9
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Rating
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.default }]}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={[styles.statValue, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
                {stats.completedOrders || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Revenue Bar Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            Weekly Revenue
          </Text>
          <Card variant="flat" style={[styles.chartCard, { backgroundColor: colors.primary }]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartSubLabel, { color: 'rgba(255,255,255,0.65)', fontFamily: typography.fontFamilies.primary }]}>
                  This Week
                </Text>
                <Text style={[styles.chartAmount, { color: '#ffffff', fontFamily: typography.fontFamilies.heading }]}>
                  ${(Number(stats.totalRevenue || 0) * 4.2).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.trendBadge, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full }]}>
                <Text style={[styles.trendText, { color: '#ffffff', fontFamily: typography.fontFamilies.primaryBold }]}>
                  ↑ 12%
                </Text>
              </View>
            </View>

            <View style={styles.chart}>
              {[
                { day: 'M', h: 55 },
                { day: 'T', h: 40 },
                { day: 'W', h: 80 },
                { day: 'T', h: 65 },
                { day: 'F', h: 90 },
                { day: 'S', h: 100, active: true },
                { day: 'S', h: 30 },
              ].map((b, i) => (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, {
                      height: `${b.h}%`,
                      backgroundColor: b.active ? '#ffffff' : 'rgba(255,255,255,0.25)',
                      borderRadius: 4,
                    }]} />
                  </View>
                  <Text style={[styles.barLabel, {
                    color: b.active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    fontFamily: typography.fontFamilies.primary,
                  }]}>
                    {b.day}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Live Orders */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
              Live Orders
            </Text>
            {liveOrders.length > 0 && (
              <View style={[styles.liveBadge, { backgroundColor: '#10B981', borderRadius: radius.full }]}>
                <Text style={[styles.liveBadgeText, { fontFamily: typography.fontFamilies.primaryBold }]}>
                  {liveOrders.length} Active
                </Text>
              </View>
            )}
          </View>

          {loading ? (
            <>
              <Skeleton height={130} style={{ marginBottom: 12 }} />
              <Skeleton height={130} />
            </>
          ) : liveOrders.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
                Kitchen is Quiet
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                No active orders right now. Pull down to refresh.
              </Text>
            </Card>
          ) : (
            liveOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={{ ...order, status: order.status === 'accepted' ? 'preparing' : order.status }}
                isChef
                onAccept={() => handleUpdateStatus(order.id, 'accept')}
                onDecline={() => handleUpdateStatus(order.id, 'reject')}
                onMarkReady={() => handleUpdateStatus(order.id, 'complete')}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  chefName: { fontSize: 22, fontWeight: '700' },
  avatar: { width: 44, height: 44 },
  revenuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  revenuePillLabel: { fontSize: 12 },
  revenuePillValue: { fontSize: 18, fontWeight: '700' },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  alertEmoji: { fontSize: 22 },
  alertTitle: { fontSize: 14, fontWeight: '700' },
  alertSub: { fontSize: 12, marginTop: 2 },
  section: { marginBottom: 28 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  pipeline: { flexDirection: 'row', gap: 10 },
  pipelineCard: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 4 },
  pipelineEmoji: { fontSize: 20, marginBottom: 6 },
  pipelineCount: { fontSize: 22, fontWeight: '800' },
  pipelineLabel: { fontSize: 10, marginTop: 2, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 4, textAlign: 'center' },
  chartCard: { padding: 20, borderRadius: 16 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  chartSubLabel: { fontSize: 11, marginBottom: 4 },
  chartAmount: { fontSize: 28, fontWeight: '800' },
  trendBadge: { paddingHorizontal: 10, paddingVertical: 5 },
  trendText: { fontSize: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 4 },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', marginBottom: 4 },
  barFill: { width: '100%' },
  barLabel: { fontSize: 9 },
  liveBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  liveBadgeText: { fontSize: 11, color: '#ffffff' },
  emptyCard: { padding: 32, alignItems: 'center' },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
