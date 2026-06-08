'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';
import { Search, Filter } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (search) {
      filtered = filtered.filter(
        (o) =>
          o.id.toString().includes(search) ||
          o.customer_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [search, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/api/admin/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'chef_name', label: 'Chef' },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (val) => `$${val.toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(val)}`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Orders Management</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-12"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Table */}
          <Table columns={columns} data={filteredOrders} loading={loading} />
        </div>
      </main>
    </div>
  );
}
