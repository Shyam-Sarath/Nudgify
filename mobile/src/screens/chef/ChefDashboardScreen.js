import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function ChefDashboardScreen() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, completedOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/chef/dashboard`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/chef/dashboard`, { headers });
      }
      setStats(res.data.data || { totalOrders: 0, totalRevenue: 0, completedOrders: 0 });
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
      Alert.alert('Error', 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading dashboard stats...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>Earnings Overview</Text>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>TOTAL REVENUE</Text>
          <Text style={styles.revenueAmount}>${parseFloat(stats.totalRevenue || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>TOTAL ORDERS</Text>
            <Text style={styles.gridValue}>{stats.totalOrders || 0}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>COMPLETED</Text>
            <Text style={styles.gridValue}>{stats.completedOrders || 0}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  scrollContent: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f5f7',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e1e24',
    marginBottom: 20,
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#ff6b35',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  statsLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  revenueAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1e24',
    marginTop: 8,
  },
});
