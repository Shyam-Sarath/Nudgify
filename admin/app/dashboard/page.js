'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useDashboardStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import apiClient from '@/lib/api';
import { Users, ChefHat, ShoppingCart, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { stats, setStats } = useDashboardStore();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        apiClient.get('/api/admin/dashboard'),
        apiClient.get('/api/admin/analytics/daily'),
      ]);

      setStats(dashRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-app">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-dark tracking-tight mb-8">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers || 0}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Total Chefs"
              value={stats.totalChefs || 0}
              icon={ChefHat}
              color="orange"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders || 0}
              icon={ShoppingCart}
              color="green"
            />
            <StatCard
              title="Total Revenue"
              value={`$${(stats.totalRevenue || 0).toFixed(2)}`}
              icon={TrendingUp}
              color="purple"
            />
          </div>

          {/* Analytics Chart */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-dark mb-6">Daily Analytics (Last 30 Days)</h2>
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#ff6b35"
                    name="Orders"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f7b32b"
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600 text-center py-8">No analytics data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
