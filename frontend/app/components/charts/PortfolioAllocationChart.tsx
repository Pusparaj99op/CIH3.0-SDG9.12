'use client';

import { useEffect, useRef } from 'react';
import { createPieChart, bondColors, PieDataPoint } from '@/lib/d3Helpers';

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

export default function PortfolioAllocationChart({ holdings }: PortfolioAllocationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || holdings.length === 0) return;

    // Group by sector
    const sectorData = holdings.reduce((acc, holding) => {
      const sector = holding.bond?.sector || 'Unknown';
      const existing = acc.find((item) => item.name === sector);
      if (existing) {
        existing.value += holding.currentValue;
      } else {
        acc.push({ name: sector, value: holding.currentValue });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    // Sort by value descending
    sectorData.sort((a, b) => b.value - a.value);

    // Calculate total for percentages
    const total = sectorData.reduce((sum, item) => sum + item.value, 0);

    // Convert to D3 pie data format
    const pieData: PieDataPoint[] = sectorData.map((item) => ({
      label: item.name,
      value: (item.value / total) * 100, // Convert to percentage
      color: bondColors[item.name as keyof typeof bondColors] || bondColors.default,
    }));

    // Create the chart
    createPieChart(chartRef.current, pieData, {
      width: chartRef.current.clientWidth,
      height: 320,
      innerRadius: 70,
      outerRadius: 120,
      showLabels: true,
      showLegend: false,
      animationDuration: 1000,
    });

    // Create custom legend below the chart
    const legendContainer = document.querySelector('.d3-legend');
    if (legendContainer) {
      legendContainer.innerHTML = '';
      pieData.forEach((item) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'flex items-center gap-2 text-sm';
        legendItem.innerHTML = `
          <div class="w-4 h-4 rounded" style="background-color: ${item.color}"></div>
          <span class="text-gray-300">${item.label}: <span class="font-semibold">${item.value.toFixed(1)}%</span></span>
        `;
        legendContainer.appendChild(legendItem);
      });
    }
  }, [holdings]);

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
    <div className="space-y-4">
      <div ref={chartRef} className="w-full relative" style={{ minHeight: '320px' }} />
      <div className="d3-legend grid grid-cols-2 gap-3 px-4" />
    </div>
  );
}
