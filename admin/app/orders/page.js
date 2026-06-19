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
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 25;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async (searchTerm = '', status = statusFilter, pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = { page: pageNumber, limit };
      if (searchTerm) params.search = searchTerm;
      if (status !== 'all') params.status = status;

      const res = await apiClient.get('/api/admin/orders', { params });
      const items = res.data.data || [];
      setOrders(items);
      setPage(pageNumber);
      setHasMore(items.length === limit);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.userMessage || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      await apiClient.put(`/api/admin/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.userMessage || 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
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
    { label: 'Customer', key: 'customer_name', render: (val) => <span className="font-bold font-serif text-primary-950 dark:text-white">{val || 'Unknown'}</span> },
    { label: 'Chef', key: 'chef_name', render: (val) => <span className="font-bold font-serif text-primary-950/80 dark:text-white/80">{val || 'Unknown'}</span> },
    { 
      label: 'Amount', 
      key: 'total_amount',
      render: (val) => <span className="font-bold font-serif text-primary-950 dark:text-white">${parseFloat(val).toFixed(2)}</span>
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
      label: 'Actions',
      key: 'id',
      render: (orderId, row) => {
        const canAccept = row.status === 'pending';
        const canComplete = row.status === 'accepted';
        const canReject = row.status !== 'rejected' && row.status !== 'completed';

        return (
          <div className="flex flex-wrap gap-2">
            {canAccept && (
              <button
                onClick={() => updateOrderStatus(orderId, 'accepted')}
                disabled={updatingOrderId === orderId}
                className="text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider bg-tertiary-100 dark:bg-white/5 hover:bg-tertiary-200 dark:hover:bg-white/10 text-primary-600 dark:text-primary-300 transition duration-300"
              >
                {updatingOrderId === orderId ? 'Updating…' : 'Accept'}
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => updateOrderStatus(orderId, 'completed')}
                disabled={updatingOrderId === orderId}
                className="text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider bg-primary-600 text-white hover:bg-primary-700 transition duration-300"
              >
                {updatingOrderId === orderId ? 'Updating…' : 'Complete'}
              </button>
            )}
            {canReject && (
              <button
                onClick={() => updateOrderStatus(orderId, 'rejected')}
                disabled={updatingOrderId === orderId}
                className="text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider bg-red-100/40 text-danger hover:bg-red-100 dark:bg-red-950/20 transition duration-300"
              >
                {updatingOrderId === orderId ? 'Updating…' : 'Reject'}
              </button>
            )}
          </div>
        );
      },
    },
    { 
      label: 'Date', 
      key: 'created_at',
      render: (val) => <span className="text-xs font-medium">{new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
    },
  ];

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Order Management</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Track and manage all platform orders, oversee delivery and statuses.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 glass-panel rounded-xl w-full md:w-auto border border-border/20">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, customers, chefs"
                className="input py-2 md:w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-2 md:w-40"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                type="button"
                onClick={() => fetchOrders(search, statusFilter, 1)}
                className="btn-primary py-2 px-6 w-full sm:w-auto shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>

          <Table columns={columns} data={orders} loading={loading} error={error} onRetry={() => fetchOrders(search, statusFilter, page)} />

          <div className="mt-6 flex items-center justify-between text-sm text-tertiary-600">
            <p className="font-serif">Page {page}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchOrders(search, statusFilter, page - 1)}
                className="btn-secondary py-2 px-5 text-xs font-serif font-bold uppercase tracking-wider rounded-full shadow-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!hasMore}
                onClick={() => fetchOrders(search, statusFilter, page + 1)}
                className="btn-secondary py-2 px-5 text-xs font-serif font-bold uppercase tracking-wider rounded-full shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
