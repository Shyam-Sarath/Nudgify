'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/admin/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      case 'accepted': return 'bg-blue-100 text-blue-700'; // custom one for accepted
      default: return 'badge-neutral';
    }
  };

  const columns = [
    { 
      label: 'Order ID', 
      key: 'id',
      render: (val) => <span className="text-gray-500 font-mono">#{String(val).padStart(5, '0')}</span>
    },
    { label: 'Customer', key: 'customer_name', render: (val) => <span className="font-medium">{val || 'Unknown'}</span> },
    { label: 'Chef', key: 'chef_name', render: (val) => <span className="font-medium text-gray-600">{val || 'Unknown'}</span> },
    { 
      label: 'Amount', 
      key: 'total_amount',
      render: (val) => <span className="font-semibold text-dark">${parseFloat(val).toFixed(2)}</span>
    },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <span className={`badge ${getStatusBadgeClass(val)}`}>
          {val}
        </span>
      ),
    },
    { 
      label: 'Date', 
      key: 'created_at',
      render: (val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
  ];

  return (
    <div className="flex h-screen bg-app">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark tracking-tight">Order Management</h1>
              <p className="text-gray-500 mt-1">Track and manage all platform orders</p>
            </div>
          </div>

          <Table columns={columns} data={orders} loading={loading} />
        </div>
      </main>
    </div>
  );
}
