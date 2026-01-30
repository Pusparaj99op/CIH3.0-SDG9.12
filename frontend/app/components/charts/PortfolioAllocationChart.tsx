'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Holding {
  bond: {
    name: string;
    sector: string;
  } | null;
  currentValue: number;
}

interface PortfolioAllocationChartProps {
  holdings: Holding[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

export default function PortfolioAllocationChart({ holdings }: PortfolioAllocationChartProps) {
  // Group by sector
  const sectorData = holdings.reduce((acc, holding) => {
    const sector = holding.bond?.sector || 'Unknown';
    const existing = acc.find(item => item.name === sector);
    if (existing) {
      existing.value += holding.currentValue;
    } else {
      acc.push({ name: sector, value: holding.currentValue });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort by value descending
  sectorData.sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-purple-400">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <span className="text-4xl block mb-2">📊</span>
          <p>No holdings to display</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={sectorData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {sectorData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
