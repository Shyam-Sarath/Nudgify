'use client';

import ErrorState from './ErrorState';
import { Loader2 } from 'lucide-react';

export default function Table({ columns, data, loading = false, error = '', onRetry }) {
  if (loading) {
    return (
      <div className="glass-panel p-12 flex flex-col items-center justify-center space-y-3 border border-border/20">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-tertiary-500 dark:text-tertiary-400 font-medium animate-pulse">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load data"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-4 border border-border/20">
        <div className="w-16 h-16 rounded-full bg-tertiary-100 dark:bg-dark-border flex items-center justify-center mb-2">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-lg font-bold text-primary-950 dark:text-white font-serif">No data available</p>
        <p className="text-tertiary-500 dark:text-tertiary-400 max-w-sm text-sm">There is currently no data to display here. Try adjusting your filters or adding new records.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden border border-border/20 dark:border-white/5 shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full whitespace-nowrap text-left">
          <thead>
            <tr className="bg-tertiary-100/70 dark:bg-dark-card border-b border-border/20 dark:border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-xs font-bold text-primary-950 dark:text-primary-300 uppercase tracking-widest font-serif"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10 dark:divide-white/5 bg-white/20 dark:bg-dark-bg/20">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-primary-100/10 dark:hover:bg-white/5 transition-colors duration-200 group">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-foreground">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
