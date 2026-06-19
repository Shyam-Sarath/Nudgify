'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function PendingChefsPage() {
  const router = useRouter();
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [approvingChefId, setApprovingChefId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPendingChefs();
  }, []);

  const fetchPendingChefs = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const params = { active: false };
      if (searchTerm) params.search = searchTerm;

      const res = await apiClient.get('/api/admin/chefs', { params });
      setChefs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching pending chefs:', err);
      setError(err.userMessage || 'Failed to fetch pending chefs.');
    } finally {
      setLoading(false);
    }
  };

  const approveChef = async (chefId) => {
    const confirmed = window.confirm('Approve this chef application? This will activate the chef on the platform.');
    if (!confirmed) return;

    try {
      setApprovingChefId(chefId);
      await apiClient.put(`/api/admin/chefs/${chefId}/approve`);
      alert('Chef approved successfully.');
      fetchPendingChefs(search);
    } catch (err) {
      console.error('Error approving chef:', err);
      alert(err?.response?.data?.message || 'Failed to approve chef.');
    } finally {
      setApprovingChefId(null);
    }
  };

  const columns = [
    { label: 'Chef', key: 'name', render: (val, row) => <div className="flex items-center space-x-3"><span className="font-bold font-serif text-primary-950 dark:text-white">{val}</span><span className="text-xs text-tertiary-500 dark:text-tertiary-400">{row.email}</span></div> },
    { label: 'Cuisine', key: 'cuisine_type', render: (val) => <span className="font-medium">{val}</span> },
    { label: 'Bio', key: 'bio', render: (val) => <span className="text-sm text-tertiary-600 dark:text-tertiary-300">{val || '—'}</span> },
    { label: 'Requested', key: 'created_at', render: (val) => <span className="font-medium">{new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span> },
    { label: 'Status', key: 'is_active', render: () => <span className="badge badge-warning">Pending</span> },
    { label: 'Actions', key: 'user_id', render: (val) => (
      <button
        onClick={() => approveChef(val)}
        disabled={approvingChefId === val}
        className={`btn-primary text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider transition ${approvingChefId === val ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {approvingChefId === val ? 'Approving...' : 'Approve'}
      </button>
    ) },
  ];

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Pending Chef Approvals</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Review and approve new chef applications.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center p-3 glass-panel rounded-xl border border-border/20">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pending chefs..."
                className="input py-2"
              />
              <button
                onClick={() => fetchPendingChefs(search)}
                className="btn-primary py-2 px-6 text-sm whitespace-nowrap"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearch('');
                  fetchPendingChefs('');
                }}
                className="btn-secondary py-2 px-6 text-sm whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          </div>

          <Table columns={columns} data={chefs} loading={loading} error={error} onRetry={() => fetchPendingChefs(search)} />
        </div>
      </main>
    </div>
  );
}
