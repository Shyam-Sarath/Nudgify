'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import ErrorState from '@/components/ErrorState';
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
  const { stats, setStats } = useDashboardStore();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setLoading(true);
      setError('');
      const [dashRes, analyticsRes] = await Promise.all([
        apiClient.get('/api/admin/dashboard'),
        apiClient.get('/api/admin/analytics/daily'),
      ]);

      setStats(dashRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error.userMessage || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Dashboard Overview</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Welcome back. Here's what's happening today.</p>
            </div>
            <div className="text-sm text-tertiary-500 font-medium font-serif">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {loading ? (
            <div className="glass-panel p-12 text-center text-tertiary-500 font-serif border border-border/20">Loading dashboard...</div>
          ) : error ? (
            <ErrorState title="Unable to load dashboard" message={error} onRetry={fetchDashboardData} />
          ) : (
            <>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Today's Orders"
                  value={stats.todaysOrders || 0}
                  icon={ShoppingCart}
                  color="cyan"
                />
                <StatCard
                  title="Today's Revenue"
                  value={`$${(stats.todaysRevenue || 0).toFixed(2)}`}
                  icon={TrendingUp}
                  color="emerald"
                />
                <StatCard
                  title="Pending Orders"
                  value={stats.pendingOrders || 0}
                  icon={ShoppingCart}
                  color="amber"
                />
                <StatCard
                  title="Pending Chef Approvals"
                  value={stats.pendingChefApprovals || 0}
                  icon={ChefHat}
                  color="orange"
                />
                <StatCard
                  title="Completed Orders"
                  value={stats.completedOrders || 0}
                  icon={ShoppingCart}
                  color="lime"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Rejected Orders"
                  value={stats.rejectedOrders || 0}
                  icon={ShoppingCart}
                  color="red"
                />
                <StatCard
                  title="Disabled Chefs"
                  value={stats.disabledChefs || 0}
                  icon={ChefHat}
                  color="slate"
                />
                <StatCard
                  title="Menu Items"
                  value={stats.totalDishes || 0}
                  icon={Users}
                  color="teal"
                />
                <StatCard
                  title="Avg Order Value"
                  value={`$${(stats.averageOrderValue || 0).toFixed(2)}`}
                  icon={TrendingUp}
                  color="fuchsia"
                />
              </div>

              {/* Analytics Chart */}
              <div className="glass-panel p-6 mt-4 border border-border/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Daily Analytics (Last 30 Days)</h2>
                  <div className="flex items-center space-x-4 text-xs font-serif uppercase tracking-wider font-bold">
                    <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-600"></span><span className="text-tertiary-600 dark:text-tertiary-400">Revenue</span></div>
                    <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary-600"></span><span className="text-tertiary-600 dark:text-tertiary-400">Orders</span></div>
                  </div>
                </div>
                {analytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e2e1" opacity={0.5} />
                      <XAxis dataKey="date" tick={{ fill: '#7e7c77', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#7e7c77', fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #c3c8c1', backgroundColor: '#fcf9f8', fontFamily: 'Inter' }} />
                      <Legend wrapperStyle={{ fontFamily: 'Manrope', fontSize: 12 }} />
                      <Line
                         type="monotone"
                         dataKey="orders"
                         stroke="#964824"
                         strokeWidth={3}
                         dot={{ r: 4, strokeWidth: 2, fill: '#ffb597' }}
                         activeDot={{ r: 6, strokeWidth: 0 }}
                         name="Orders"
                      />
                      <Line
                         type="monotone"
                         dataKey="revenue"
                         stroke="#334537"
                         strokeWidth={3}
                         dot={{ r: 4, strokeWidth: 2, fill: '#b7ccb9' }}
                         activeDot={{ r: 6, strokeWidth: 0 }}
                         name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-tertiary-500 text-center py-8 font-serif">No analytics data available</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
