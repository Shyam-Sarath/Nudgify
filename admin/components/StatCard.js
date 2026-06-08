'use client';

export default function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-primary',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-dark mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </div>
  );
}
