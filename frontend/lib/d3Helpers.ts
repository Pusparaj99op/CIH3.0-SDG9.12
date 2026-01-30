import * as d3 from 'd3';
import { prefersReducedMotion, isMobile } from './animations';

// D3 Chart color schemes
export const bondColors = {
  Transportation: '#3b82f6', // blue
  Energy: '#10b981',         // green
  'Water Supply': '#06b6d4', // cyan
  Healthcare: '#8b5cf6',     // purple
  Education: '#f59e0b',      // amber
  Technology: '#ec4899',     // pink
  default: '#6366f1',        // indigo
};

export const riskColors = {
  Low: '#10b981',    // green
  Medium: '#f59e0b', // amber
  High: '#ef4444',   // red
};

// Get animation duration based on preferences
export const getD3Duration = (duration: number): number => {
  if (prefersReducedMotion()) return 0;
  if (isMobile()) return duration * 0.7;
  return duration;
};

// Pie chart helpers
export interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

export const createPieChart = (
  container: HTMLElement,
  data: PieDataPoint[],
  options: {
    width?: number;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    showLabels?: boolean;
    showLegend?: boolean;
    animationDuration?: number;
  } = {}
) => {
  const {
    width = container.clientWidth || 400,
    height = container.clientHeight || 400,
    innerRadius = 0,
    outerRadius = Math.min(width, height) / 2 - 20,
    showLabels = true,
    showLegend = true,
    animationDuration = 800,
  } = options;

  // Clear existing content
  d3.select(container).selectAll('*').remove();

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  // Create pie layout
  const pie = d3
    .pie<PieDataPoint>()
    .value((d) => d.value)
    .sort(null);

  // Create arc generator
  const arc = d3
    .arc<d3.PieArcDatum<PieDataPoint>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  // Create hover arc (slightly larger)
  const arcHover = d3
    .arc<d3.PieArcDatum<PieDataPoint>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius + 10);

  // Draw slices
  const slices = g
    .selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('fill', (d) => d.data.color || bondColors.default)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      if (prefersReducedMotion()) return;
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arcHover as any);
    })
    .on('mouseout', function (event, d) {
      if (prefersReducedMotion()) return;
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arc as any);
    });

  // Animate slices entrance
  slices
    .attr('d', d3.arc<d3.PieArcDatum<PieDataPoint>>().innerRadius(innerRadius).outerRadius(0) as any)
    .transition()
    .duration(getD3Duration(animationDuration))
    .delay((d, i) => i * 100)
    .attrTween('d', function (d) {
      const interpolate = d3.interpolate(
        { startAngle: 0, endAngle: 0 },
        { startAngle: d.startAngle, endAngle: d.endAngle }
      );
      return function (t) {
        const interpolated = interpolate(t);
        return arc({
          ...d,
          startAngle: interpolated.startAngle,
          endAngle: interpolated.endAngle,
        } as d3.PieArcDatum<PieDataPoint>) || '';
      };
    });

  // Add labels
  if (showLabels) {
    const labelArc = d3
      .arc<d3.PieArcDatum<PieDataPoint>>()
      .innerRadius(outerRadius * 0.6)
      .outerRadius(outerRadius * 0.6);

    g.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', isMobile() ? '10px' : '12px')
      .attr('font-weight', '600')
      .style('opacity', 0)
      .text((d) => `${d.data.value.toFixed(0)}%`)
      .transition()
      .duration(getD3Duration(animationDuration))
      .delay((d, i) => i * 100 + animationDuration / 2)
      .style('opacity', 1);
  }

  return { svg, g, slices };
};

// Line chart helpers
export interface LineDataPoint {
  date: Date;
  value: number;
}

export const createLineChart = (
  container: HTMLElement,
  data: LineDataPoint[],
  options: {
    width?: number;
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    showGrid?: boolean;
    showArea?: boolean;
    lineColor?: string;
    areaColor?: string;
    animationDuration?: number;
  } = {}
) => {
  const {
    width = container.clientWidth || 600,
    height = container.clientHeight || 300,
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    showGrid = true,
    showArea = true,
    lineColor = '#3b82f6',
    areaColor = 'rgba(59, 130, 246, 0.2)',
    animationDuration = 1000,
  } = options;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Clear existing content
  d3.select(container).selectAll('*').remove();

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date) as [Date, Date])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) as number])
    .nice()
    .range([innerHeight, 0]);

  // Add grid
  if (showGrid) {
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );
  }

  // Create line generator
  const line = d3
    .line<LineDataPoint>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX);

  // Create area generator
  const area = d3
    .area<LineDataPoint>()
    .x((d) => xScale(d.date))
    .y0(innerHeight)
    .y1((d) => yScale(d.value))
    .curve(d3.curveMonotoneX);

  // Draw area
  if (showArea) {
    const areaPath = g
      .append('path')
      .datum(data)
      .attr('fill', areaColor)
      .attr('d', area);

    // Animate area
    const totalLength = (areaPath.node() as SVGPathElement).getTotalLength();
    areaPath
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .attr('opacity', 0)
      .transition()
      .duration(getD3Duration(animationDuration))
      .attr('stroke-dashoffset', 0)
      .attr('opacity', 1);
  }

  // Draw line
  const linePath = g
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 2)
    .attr('d', line);

  // Animate line
  const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
  linePath
    .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(getD3Duration(animationDuration))
    .ease(d3.easeCubicInOut)
    .attr('stroke-dashoffset', 0);

  // Add dots
  const dots = g
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.date))
    .attr('cy', (d) => yScale(d.value))
    .attr('r', 0)
    .attr('fill', lineColor)
    .style('cursor', 'pointer');

  dots
    .transition()
    .duration(getD3Duration(300))
    .delay((d, i) => (animationDuration / data.length) * i)
    .attr('r', 4);

  // Add tooltip
  const tooltip = d3
    .select(container)
    .append('div')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', 'white')
    .style('padding', '8px 12px')
    .style('border-radius', '6px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('transition', 'opacity 0.2s');

  dots
    .on('mouseover', function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 6);

      tooltip
        .style('opacity', 1)
        .html(
          `<strong>${d.date.toLocaleDateString()}</strong><br/>₹${d.value.toLocaleString()}`
        )
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 30}px`);
    })
    .on('mouseout', function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 4);

      tooltip.style('opacity', 0);
    });

  // Add axes
  const xAxis = g
    .append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(isMobile() ? 4 : 6))
    .attr('color', '#94a3b8');

  const yAxis = g
    .append('g')
    .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `₹${d}`))
    .attr('color', '#94a3b8');

  return { svg, g, linePath, dots, xScale, yScale };
};

// Bar chart helper
export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export const createBarChart = (
  container: HTMLElement,
  data: BarDataPoint[],
  options: {
    width?: number;
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    animationDuration?: number;
  } = {}
) => {
  const {
    width = container.clientWidth || 600,
    height = container.clientHeight || 300,
    margin = { top: 20, right: 20, bottom: 40, left: 60 },
    animationDuration = 800,
  } = options;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Clear existing content
  d3.select(container).selectAll('*').remove();

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Create scales
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) as number])
    .nice()
    .range([innerHeight, 0]);

  // Draw bars
  const bars = g
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.label) || 0)
    .attr('width', xScale.bandwidth())
    .attr('fill', (d) => d.color || bondColors.default)
    .attr('rx', 4)
    .style('cursor', 'pointer');

  // Animate bars
  bars
    .attr('y', innerHeight)
    .attr('height', 0)
    .transition()
    .duration(getD3Duration(animationDuration))
    .delay((d, i) => i * 100)
    .attr('y', (d) => yScale(d.value))
    .attr('height', (d) => innerHeight - yScale(d.value));

  // Add axes
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .attr('color', '#94a3b8')
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

  g.append('g')
    .call(d3.axisLeft(yScale).tickFormat((d) => `₹${d}`))
    .attr('color', '#94a3b8');

  return { svg, g, bars, xScale, yScale };
};

export default {
  bondColors,
  riskColors,
  getD3Duration,
  createPieChart,
  createLineChart,
  createBarChart,
};
