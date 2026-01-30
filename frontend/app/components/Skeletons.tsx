export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              {[1, 2, 3, 4, 5].map(i => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-white/20 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i}>
                {[1, 2, 3, 4, 5].map(j => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-white/10 rounded w-24"></div>
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

export function CardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-white/20 rounded w-2/3 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-10 bg-white/20 rounded flex-1"></div>
        <div className="h-10 bg-white/20 rounded flex-1"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="h-4 bg-white/20 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="h-6 bg-white/20 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-white/5 rounded"></div>
      </div>

      {/* Transactions */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                <div>
                  <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-20"></div>
                </div>
              </div>
              <div className="h-5 bg-white/20 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
