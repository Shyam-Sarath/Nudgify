'use client';

export default function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-primary',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="glass-panel p-6 flex items-center hover:-translate-y-1 transition-transform duration-300">
      <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
        <Icon size={28} />
      </div>
      <div className="ml-5">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-dark mt-1">{value}</p>
      </div>
    </div>
  );
}
