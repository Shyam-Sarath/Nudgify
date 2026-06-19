'use client';

import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">System Settings</h1>
            <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">Configure global platform preferences and administrative settings.</p>
          </div>

          <div className="glass-panel p-10 flex flex-col items-center justify-center text-center space-y-4 border border-border/20">
            <div className="w-20 h-20 rounded-full bg-tertiary-100 dark:bg-tertiary-900/20 flex items-center justify-center mb-2">
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-xl font-bold font-serif text-primary-950 dark:text-white">Settings are under construction</p>
            <p className="text-sm text-tertiary-500 dark:text-tertiary-400 max-w-md">We're currently building out the settings panel. Check back soon for more configuration options.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
