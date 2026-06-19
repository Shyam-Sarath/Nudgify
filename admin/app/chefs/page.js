'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import AddChefModal from '@/components/AddChefModal';
import apiClient from '@/lib/api';

export default function ChefsPage() {
  const router = useRouter();
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (activeFilter !== 'all') params.active = activeFilter === 'active';
      const res = await apiClient.get('/api/admin/chefs', { params });
      setChefs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chefs:', error);
      setError(error.userMessage || 'Failed to fetch chefs.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus) {
        await apiClient.put(`/api/admin/users/${userId}/disable`);
        setChefs(chefs.map(c => c.user_id === userId ? { ...c, is_active: false } : c));
      } else {
        await apiClient.put(`/api/admin/users/${userId}/enable`);
        setChefs(chefs.map(c => c.user_id === userId ? { ...c, is_active: true } : c));
      }
    } catch (error) {
      console.error('Error updating chef status:', error);
      alert('Failed to update chef status');
    }
  };

  const columns = [
    { 
      label: 'Chef', 
      key: 'name', 
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <img 
            src={row.profile_image || 'https://placehold.co/100'} 
            alt={row.name} 
            className="w-10 h-10 rounded-full object-cover border border-border/20"
          />
          <div>
            <p className="font-bold font-serif text-primary-950 dark:text-white">{row.name}</p>
            <p className="text-xs text-tertiary-500 dark:text-tertiary-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { label: 'Cuisine', key: 'cuisine_type', render: (val) => <span className="font-medium">{val}</span> },
    { 
      label: 'Rating', 
      key: 'rating',
      render: (val) => (
        <span className="flex items-center space-x-1 text-secondary-600 font-bold font-serif">
          <span>★</span>
          <span>{val ? val.toFixed(1) : 'N/A'}</span>
        </span>
      )
    },
    { 
      label: 'Joined Date', 
      key: 'created_at',
      render: (val) => <span className="font-medium">{new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    },
    {
      label: 'Status',
      key: 'is_active',
      render: (val) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      label: 'Actions',
      key: 'user_id',
      render: (userId, row) => (
        <button
          onClick={() => handleToggleStatus(userId, row.is_active)}
          className={`text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider transition duration-300 ${
            row.is_active 
              ? 'bg-red-100/40 text-danger hover:bg-red-100 dark:bg-red-950/20' 
              : 'bg-primary-100/40 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/20 dark:text-primary-300'
          }`}
        >
          {row.is_active ? 'Disable' : 'Enable'}
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
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Chefs Directory</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Manage approved home chefs, view their performance and change statuses.</p>
            </div>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>Add New Chef</button>
          </div>

          <div className="glass-panel p-5 grid gap-4 md:grid-cols-3 mb-8 border border-border/20">
            <div className="space-y-2">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Search Chefs</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, cuisine, bio"
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
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="button" onClick={fetchChefs} className="btn-primary w-full shadow-sm">Apply Filters</button>
            </div>
          </div>

          {showAdd && (
            <AddChefModal
              onClose={() => setShowAdd(false)}
              onCreated={() => {
                setShowAdd(false);
                fetchChefs();
              }}
            />
          )}

          <Table columns={columns} data={chefs} loading={loading} error={error} onRetry={fetchChefs} />
        </div>
      </main>
    </div>
  );
}
