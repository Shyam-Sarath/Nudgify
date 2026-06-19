'use client';

export default function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-300',
    green: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-300',
    orange: 'bg-secondary-100 dark:bg-secondary-950/30 text-secondary-600 dark:text-secondary-300',
    purple: 'bg-secondary-100 dark:bg-secondary-950/30 text-secondary-600 dark:text-secondary-300',
    cyan: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-300',
    emerald: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-300',
    amber: 'bg-secondary-100 dark:bg-secondary-950/30 text-secondary-600 dark:text-secondary-300',
    lime: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-300',
    red: 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-300',
    slate: 'bg-tertiary-200 dark:bg-tertiary-900/30 text-tertiary-700 dark:text-tertiary-300',
    teal: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-300',
    fuchsia: 'bg-secondary-100 dark:bg-secondary-950/30 text-secondary-600 dark:text-secondary-300',
  };

  return (
    <div className="glass-panel p-6 flex items-center hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden relative border border-border/20">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-[0.02] rounded-full group-hover:scale-150 transition-transform duration-500" />
      <div className={`p-3.5 rounded-full ${colorClasses[color]} shadow-sm transition-shadow`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="ml-5 flex-1">
        <p className="text-xs font-bold text-tertiary-500 dark:text-tertiary-400 uppercase tracking-widest font-serif">{title}</p>
        <p className="text-2xl font-bold text-primary-950 dark:text-white mt-1 tracking-tight font-serif">{value}</p>
      </div>
    </div>
  );
}
