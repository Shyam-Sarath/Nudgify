'use client';

import Sidebar from '@/components/Sidebar';

export default function NotificationsPage() {
  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-10 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Notification Center</h1>
            <p className="text-sm text-tertiary-500 dark:text-tertiary-400 mt-1">System alerts and notifications for the admin team.</p>
          </div>

          <div className="glass-panel p-10 flex flex-col items-center justify-center text-center space-y-4 border border-border/20">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-950/20 flex items-center justify-center mb-2">
              <span className="text-3xl">🔔</span>
            </div>
            <p className="text-xl font-bold font-serif text-primary-950 dark:text-white">You're all caught up!</p>
            <p className="text-sm text-tertiary-500 dark:text-tertiary-400 max-w-md">There are no new notifications at this time. We will alert you here if there are any critical system events.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
