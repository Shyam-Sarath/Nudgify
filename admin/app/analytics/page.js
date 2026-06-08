'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
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

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get('/api/admin/analytics/daily');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#ff6b35', '#f7b32b', '#4ecdc4', '#95e1d3'];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Analytics</h1>

          {loading ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Daily Orders Chart */}
              <div className="card">
                <h2 className="text-xl font-bold text-dark mb-6">Daily Orders (Last 30 Days)</h2>
                {analytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#ff6b35" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-600 text-center py-8">No data available</p>
                )}
              </div>

              {/* Revenue Chart */}
              <div className="card">
                <h2 className="text-xl font-bold text-dark mb-6">Daily Revenue (Last 30 Days)</h2>
                {analytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f7b32b"
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-600 text-center py-8">No data available</p>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.length > 0 && (
                  <>
                    <div className="card">
                      <p className="text-gray-600 text-sm font-medium">Total Orders (30d)</p>
                      <p className="text-3xl font-bold text-dark mt-2">
                        {analytics.reduce((sum, item) => sum + parseInt(item.orders), 0)}
                      </p>
                    </div>
                    <div className="card">
                      <p className="text-gray-600 text-sm font-medium">Total Revenue (30d)</p>
                      <p className="text-3xl font-bold text-dark mt-2">
                        ${analytics.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="card">
                      <p className="text-gray-600 text-sm font-medium">Avg Revenue/Day</p>
                      <p className="text-3xl font-bold text-dark mt-2">
                        ${(
                          analytics.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0) /
                          analytics.length
                        ).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
