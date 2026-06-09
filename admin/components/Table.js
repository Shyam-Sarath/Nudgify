'use client';

export default function Table({ columns, data, loading = false }) {
  if (loading) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white/40">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors duration-200">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-800">
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
