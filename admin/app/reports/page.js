'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ErrorState from '@/components/ErrorState';
import apiClient from '@/lib/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { exportToCSV } from '@/lib/exportUtils';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchAnalytics();
  }, []);

  const groupByWeek = (data) => {
    const groups = {};

    data.forEach((item) => {
      const date = new Date(item.date);
      const day = date.getDay();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - day);
      const label = weekStart.toISOString().substring(0, 10);

      if (!groups[label]) {
        groups[label] = { week: label, orders: 0, revenue: 0 };
      }
      groups[label].orders += item.orders;
      groups[label].revenue += item.revenue;
    });

    return Object.values(groups).sort((a, b) => a.week.localeCompare(b.week));
  };

  const groupByMonth = (data) => {
    const groups = {};

    data.forEach((item) => {
      const monthKey = item.date.substring(0, 7);
      if (!groups[monthKey]) {
        groups[monthKey] = { month: monthKey, orders: 0, revenue: 0 };
      }
      groups[monthKey].orders += item.orders;
      groups[monthKey].revenue += item.revenue;
    });

    return Object.values(groups).sort((a, b) => a.month.localeCompare(b.month));
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/admin/analytics/daily');
      setAnalytics(response.data.data);
      setWeeklyData(groupByWeek(response.data.data));
      setMonthlyData(groupByMonth(response.data.data));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.userMessage || 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#ff6b35', '#f7b32b', '#4ecdc4', '#95e1d3'];

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Financial & Order Reports</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Detailed breakdown of platform activity and revenue over time.</p>
            </div>
            <button
              onClick={() => exportToCSV(analytics, 'daily_analytics')}
              className="btn-secondary flex items-center space-x-2 text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider shadow-sm"
              disabled={loading || analytics.length === 0}
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>

          {loading ? (
            <div className="glass-panel p-12 text-center border border-border/20 text-tertiary-500 font-serif">
              <p className="animate-pulse">Loading analytics...</p>
            </div>
          ) : error ? (
            <ErrorState title="Unable to load analytics" message={error} onRetry={fetchAnalytics} />
          ) : (
            <div className="space-y-8">
              {/* Daily Orders Chart */}
              <div className="glass-panel p-6 border border-border/20">
                <h2 className="text-xl font-bold font-serif text-primary-950 dark:text-white tracking-tight mb-6">Daily Orders (Last 30 Days)</h2>
                {analytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e2e1" opacity={0.5} />
                      <XAxis dataKey="date" tick={{ fill: '#7e7c77', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#7e7c77', fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #c3c8c1', backgroundColor: '#fcf9f8', fontFamily: 'Inter' }} />
                      <Bar dataKey="orders" fill="#964824" name="Orders" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-tertiary-500 text-center py-8 font-serif">No data available</p>
                )}
              </div>

              {/* Revenue Chart */}
              <div className="glass-panel p-6 border border-border/20">
                <h2 className="text-xl font-bold font-serif text-primary-950 dark:text-white tracking-tight mb-6">Daily Revenue (Last 30 Days)</h2>
                {analytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e2e1" opacity={0.5} />
                      <XAxis dataKey="date" tick={{ fill: '#7e7c77', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#7e7c77', fontSize: 11 }} />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ borderRadius: '16px', border: '1px solid #c3c8c1', backgroundColor: '#fcf9f8', fontFamily: 'Inter' }} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#334537"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#b7ccb9' }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-tertiary-500 text-center py-8 font-serif">No data available</p>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.length > 0 && (
                  <>
                    <div className="glass-panel p-6 flex flex-col justify-center items-center text-center border border-border/20">
                      <p className="text-tertiary-500 dark:text-tertiary-400 text-xs font-bold uppercase tracking-widest font-serif">Total Orders (30d)</p>
                      <p className="text-4xl font-bold font-serif text-primary-950 dark:text-white mt-3">
                        {analytics.reduce((sum, item) => sum + parseInt(item.orders), 0)}
                      </p>
                    </div>
                    <div className="glass-panel p-6 flex flex-col justify-center items-center text-center border border-border/20">
                      <p className="text-tertiary-500 dark:text-tertiary-400 text-xs font-bold uppercase tracking-widest font-serif">Total Revenue (30d)</p>
                      <p className="text-4xl font-bold font-serif text-secondary-600 dark:text-secondary-400 mt-3">
                        ${analytics.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="glass-panel p-6 flex flex-col justify-center items-center text-center border border-border/20">
                      <p className="text-tertiary-500 dark:text-tertiary-400 text-xs font-bold uppercase tracking-widest font-serif">Avg Revenue/Day</p>
                      <p className="text-4xl font-bold font-serif text-primary-950 dark:text-white mt-3">
                        ${(
                          analytics.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0) /
                          analytics.length
                        ).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="glass-panel p-6 border border-border/20">
                  <h2 className="text-xl font-bold font-serif text-primary-950 dark:text-white tracking-tight mb-6">Weekly Orders</h2>
                  {weeklyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e2e1" opacity={0.5} />
                        <XAxis dataKey="week" tick={{ fill: '#7e7c77', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#7e7c77', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #c3c8c1', backgroundColor: '#fcf9f8', fontFamily: 'Inter' }} />
                        <Bar dataKey="orders" fill="#964824" name="Orders" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-tertiary-500 text-center py-8 font-serif">No weekly data available</p>
                  )}
                </div>

                <div className="glass-panel p-6 border border-border/20">
                  <h2 className="text-xl font-bold font-serif text-primary-950 dark:text-white tracking-tight mb-6">Monthly Revenue</h2>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e2e1" opacity={0.5} />
                        <XAxis dataKey="month" tick={{ fill: '#7e7c77', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#7e7c77', fontSize: 11 }} />
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ borderRadius: '16px', border: '1px solid #c3c8c1', backgroundColor: '#fcf9f8', fontFamily: 'Inter' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#334537" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#b7ccb9' }} name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-tertiary-500 text-center py-8 font-serif">No monthly data available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
