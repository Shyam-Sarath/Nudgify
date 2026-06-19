'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function ActivityLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 25;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchLogs();
  }, []);

  const fetchLogs = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.get('/api/admin/activity-logs', { params: { page: pageNumber, limit } });
      const items = res.data.data || [];
      setLogs(items);
      setPage(pageNumber);
      setHasMore(items.length === limit);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err.userMessage || 'Failed to fetch activity logs.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { label: 'Action', key: 'action' },
    { label: 'Target Type', key: 'target_type' },
    { label: 'Target ID', key: 'target_id' },
    { label: 'Admin ID', key: 'admin_id' },
    {
      label: 'Details',
      key: 'details',
      render: (val) => <pre className="whitespace-pre-wrap text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-black/20 p-2 rounded max-h-32 overflow-y-auto">{JSON.stringify(val || {}, null, 2)}</pre>,
    },
    {
      label: 'Created',
      key: 'created_at',
      render: (val) => new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    },
  ];

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">System Activity Logs</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Monitor critical administrative activity and audit trails.</p>
            </div>
          </div>

          <Table columns={columns} data={logs} loading={loading} error={error} onRetry={() => fetchLogs(page)} />

          <div className="mt-6 flex items-center justify-between text-sm text-tertiary-600">
            <p className="font-serif">Page {page}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchLogs(page - 1)}
                className="btn-secondary py-2 px-5 text-xs font-serif font-bold uppercase tracking-wider rounded-full shadow-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!hasMore}
                onClick={() => fetchLogs(page + 1)}
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
