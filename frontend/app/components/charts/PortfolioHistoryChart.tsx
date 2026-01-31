'use client';

import { useEffect, useRef } from 'react';
import { createLineChart, LineDataPoint } from '@/lib/d3Helpers';

interface PortfolioHistoryChartProps {
  currentValue: number;
  totalInvested: number;
}

// Generate mock historical data based on current portfolio
function generateHistoricalData(currentValue: number, totalInvested: number): LineDataPoint[] {
  const data: LineDataPoint[] = [];
  const days = 30;
  const today = new Date();

  // Calculate a growth factor
  const growthRate = currentValue > 0 ? currentValue / Math.max(totalInvested, 1) : 1;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Create a smooth progression with some variation
    const progress = (days - i) / days;
    const baseValue = totalInvested * (1 + (growthRate - 1) * progress);

    // Add some realistic variation (-2% to +2%)
    const variation = 1 + Math.sin(i * 0.5) * 0.02 + (Math.random() - 0.5) * 0.01;
    const value = Math.round(baseValue * variation);

    data.push({
      date: date,
      value: Math.max(value, 0),
    });
  }

  return data;
}

export default function PortfolioHistoryChart({
  currentValue,
  totalInvested,
}: PortfolioHistoryChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || (currentValue === 0 && totalInvested === 0)) return;

    const data = generateHistoricalData(currentValue, totalInvested);

    // Create the line chart
    createLineChart(chartRef.current, data, {
      width: chartRef.current.clientWidth,
      height: 300,
      margin: { top: 20, right: 30, bottom: 40, left: 60 },
      showGrid: true,
      showArea: true,
      lineColor: '#10b981',
      areaColor: 'rgba(16, 185, 129, 0.2)',
      animationDuration: 1200,
    });
  }, [currentValue, totalInvested]);

  if (currentValue === 0 && totalInvested === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <span className="text-4xl block mb-2">📈</span>
          <p>Start investing to see your portfolio history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={chartRef} className="w-full" style={{ minHeight: '300px' }} />
    </div>
  );
}
