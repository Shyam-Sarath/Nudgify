'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function DishesPage() {
  const router = useRouter();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 25;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDishes();
  }, []);

  const fetchDishes = async (searchTerm = '', status = statusFilter, pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = { page: pageNumber, limit };
      if (searchTerm) params.search = searchTerm;
      if (status !== 'all') params.status = status;
      const res = await apiClient.get('/api/admin/dishes', { params });
      const items = res.data.data || [];
      setDishes(items);
      setPage(pageNumber);
      setHasMore(items.length === limit);
    } catch (err) {
      console.error('Error fetching dishes:', err);
      setError(err.userMessage || 'Failed to fetch dishes.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      setUpdatingId(dish.id);
      const newAvailability = !dish.availability;
      await apiClient.put(`/api/admin/dishes/${dish.id}/availability`, { availability: newAvailability });
      setDishes((prev) => prev.map((item) => item.id === dish.id ? { ...item, availability: newAvailability } : item));
    } catch (err) {
      console.error('Error updating availability:', err);
      alert(err.userMessage || 'Failed to update availability.');
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      label: 'Dish',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img src={row.image_url || 'https://placehold.co/80'} alt={val} className="w-16 h-16 rounded-xl object-cover border border-border/20" />
          <div>
            <p className="font-bold font-serif text-primary-950 dark:text-white">{val}</p>
            <p className="text-xs text-tertiary-500 dark:text-tertiary-400">{row.category || 'Uncategorized'}</p>
          </div>
        </div>
      ),
    },
    { label: 'Chef', key: 'chef_name', render: (val) => <span className="font-semibold">{val}</span> },
    { label: 'Price', key: 'price', render: (val) => <span className="font-bold font-serif text-primary-950 dark:text-white">${parseFloat(val).toFixed(2)}</span> },
    { label: 'Available', key: 'availability', render: (val) => <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>{val ? 'Yes' : 'No'}</span> },
    { label: 'Created', key: 'created_at', render: (val) => <span className="font-medium">{new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span> },
    { label: 'Actions', key: 'id', render: (id, row) => (
      <button
        disabled={updatingId === id}
        onClick={() => toggleAvailability(row)}
        className={`text-xs px-4 py-1.5 rounded-full font-bold font-serif uppercase tracking-wider transition duration-300 ${
          row.availability 
            ? 'bg-red-100/40 text-danger hover:bg-red-100 dark:bg-red-950/20' 
            : 'bg-primary-100/40 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/20 dark:text-primary-300'
        }`}
      >
        {updatingId === id ? 'Saving...' : row.availability ? 'Disable' : 'Enable'}
      </button>
    ) },
  ];

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-7xl mx-auto animate-fade-in">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Dish Catalog</h1>
              <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Admin management for dishes and availability.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 glass-panel rounded-xl w-full md:w-auto border border-border/20">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, chef, category"
                className="input py-2 md:w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-2 md:w-40"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <button type="button" onClick={() => fetchDishes(search, statusFilter, 1)} className="btn-primary py-2 px-6 w-full sm:w-auto shadow-sm">
                Apply
              </button>
            </div>
          </div>

          <Table columns={columns} data={dishes} loading={loading} error={error} onRetry={() => fetchDishes(search, statusFilter, page)} />

          <div className="mt-6 flex items-center justify-between text-sm text-tertiary-600">
            <p className="font-serif">Page {page}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchDishes(search, statusFilter, page - 1)}
                className="btn-secondary py-2 px-5 text-xs font-serif font-bold uppercase tracking-wider rounded-full shadow-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!hasMore}
                onClick={() => fetchDishes(search, statusFilter, page + 1)}
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
