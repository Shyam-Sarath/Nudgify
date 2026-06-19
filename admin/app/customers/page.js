'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { role: 'customer' };
      if (search) params.search = search;
      if (activeFilter !== 'all') params.active = activeFilter === 'active';
      const res = await apiClient.get('/api/admin/users', { params });
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError(error.userMessage || 'Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus) {
        await apiClient.put(`/api/admin/users/${userId}/disable`);
        setCustomers(customers.map(c => c.id === userId ? { ...c, active: false } : c));
      } else {
        await apiClient.put(`/api/admin/users/${userId}/enable`);
        setCustomers(customers.map(c => c.id === userId ? { ...c, active: true } : c));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update status');
    }
  };

  const columns = [
    { label: 'Name', key: 'name', render: (val) => <span className="font-bold font-serif text-primary-950 dark:text-white">{val}</span> },
    { label: 'Email', key: 'email' },
    { 
      label: 'Joined Date', 
      key: 'created_at',
      render: (val) => <span className="font-medium">{new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    },
    {
      label: 'Status',
      key: 'active',
      render: (val) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (id, row) => (
        <button
          onClick={() => handleToggleStatus(id, row.active)}
          className={`text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider transition duration-300 ${
            row.active 
              ? 'bg-red-100/40 text-danger hover:bg-red-100 dark:bg-red-950/20' 
              : 'bg-primary-100/40 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/20 dark:text-primary-300'
          }`}
        >
          {row.active ? 'Disable' : 'Enable'}
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Customers Directory</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Manage registered customers and view their activity.</p>
            </div>
          </div>

          <div className="glass-panel p-5 grid gap-4 md:grid-cols-3 mb-8 border border-border/20">
            <div className="space-y-2">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Search Customers</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Status Filter</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Disabled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="button" onClick={fetchCustomers} className="btn-primary w-full shadow-sm">Apply Filters</button>
            </div>
          </div>

          <Table columns={columns} data={customers} loading={loading} error={error} onRetry={fetchCustomers} />
        </div>
      </main>
    </div>
  );
}
