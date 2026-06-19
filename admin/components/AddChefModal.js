'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';
import { X, UploadCloud, Loader2 } from 'lucide-react';

export default function AddChefModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    cuisine_type: '',
    bio: '',
  });
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, profileImageBase64: imageBase64 };
      const res = await apiClient.post('/api/admin/chefs', payload);
      onCreated && onCreated(res.data.data);
      alert('Chef created successfully');
      onClose();
    } catch (err) {
      console.error('Add chef error', err);
      setError(err?.userMessage || err?.response?.data?.message || 'Failed to create chef');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-primary-950/40 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-border/10 dark:border-white/5">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border/15 dark:border-white/5 bg-tertiary-100/50 dark:bg-white/5">
          <h3 className="text-xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Add New Chef</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-tertiary-200 dark:hover:bg-white/10 text-tertiary-500 dark:text-tertiary-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Full Name</label>
              <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="input" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Email Address</label>
              <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} className="input" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Phone Number</label>
              <input name="phone" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="input" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Cuisine Expertise</label>
            <input name="cuisine_type" placeholder="e.g. Italian, Thai, Baking" value={form.cuisine_type} onChange={handleChange} className="input" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Biography</label>
            <textarea name="bio" placeholder="Tell us about the chef's experience..." value={form.bio} onChange={handleChange} className="input min-h-[100px] resize-y" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-tertiary-600 dark:text-tertiary-400 uppercase tracking-widest font-serif">Profile Image</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center w-full max-w-[200px] h-32 px-4 transition bg-tertiary-100/50 dark:bg-white/5 border-2 border-border/30 dark:border-dark-border border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary-600 focus:outline-none">
                <span className="flex flex-col items-center space-y-2">
                  <UploadCloud className="w-6 h-6 text-tertiary-400" />
                  <span className="font-bold text-tertiary-500 dark:text-tertiary-400 text-xs tracking-wider uppercase font-serif">Drop image here</span>
                </span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
              {imageBase64 && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border/20 dark:border-dark-border shadow-sm">
                  <img src={imageBase64} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-start space-x-2">
              <span className="text-danger">⚠️</span>
              <p className="text-sm font-medium text-danger">{error}</p>
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3 border-t border-border/10 dark:border-white/5">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary flex items-center space-x-2" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              <span>{loading ? 'Creating...' : 'Create Chef'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
