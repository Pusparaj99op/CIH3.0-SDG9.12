'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion, isMobile } from '@/lib/animations';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function RiskGauge({ score, size = 'md', showLabel = true }: RiskGaugeProps) {
  const gaugeRef = useRef<SVGSVGElement>(null);
  const scoreRef = useRef<SVGTextElement>(null);
  const arcRef = useRef<SVGPathElement>(null);

  // Ensure score is within bounds
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine risk level based on score
  const getRiskLevel = (score: number) => {
    if (score <= 33) return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-500' };
    if (score <= 66) return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500' };
    return { level: 'High', color: 'text-red-400', bgColor: 'bg-red-500' };
  };

  const risk = getRiskLevel(normalizedScore);

  // Size configurations
  const sizeConfig = {
    sm: { width: 100, height: 60, strokeWidth: 8, fontSize: 'text-lg', labelSize: 'text-xs' },
    md: { width: 140, height: 80, strokeWidth: 10, fontSize: 'text-2xl', labelSize: 'text-sm' },
    lg: { width: 180, height: 100, strokeWidth: 12, fontSize: 'text-3xl', labelSize: 'text-base' },
  };

  const config = sizeConfig[size];

  // SVG arc calculations
  const radius = (config.width - config.strokeWidth) / 2;
  const centerX = config.width / 2;
  const centerY = config.height - 5;

  // Arc path for semi-circle (180 degrees)
  const startAngle = Math.PI;
  const endAngle = 0;
  const arcLength = Math.PI;

  // Calculate filled portion based on score
  const filledAngle = startAngle - (normalizedScore / 100) * arcLength;

  // Path calculations
  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);
  const filledEndX = centerX + radius * Math.cos(filledAngle);
  const filledEndY = centerY + radius * Math.sin(filledAngle);

  // Determine large arc flag
  const largeArcFlag = normalizedScore > 50 ? 1 : 0;

  // Background arc path (full semi-circle)
  const bgPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  // Filled arc path
  const filledPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${filledEndX} ${filledEndY}`;

  // Gradient colors based on score position
  const getGradientColor = () => {
    if (normalizedScore <= 33) return { start: '#22c55e', end: '#16a34a' };
    if (normalizedScore <= 66) return { start: '#eab308', end: '#ca8a04' };
    return { start: '#ef4444', end: '#dc2626' };
  };

  const gradient = getGradientColor();

  // GSAP Animation on mount
  useEffect(() => {
    if (prefersReducedMotion() || !arcRef.current || !scoreRef.current) return;

    // Animate the arc drawing
    const arcLength = arcRef.current.getTotalLength();
    
    gsap.fromTo(
      arcRef.current,
      {
        strokeDasharray: arcLength,
        strokeDashoffset: arcLength,
      },
      {
        strokeDashoffset: 0,
        duration: isMobile() ? 1 : 1.5,
        ease: 'power2.out',
        delay: 0.2,
      }
    );

    // Animate the score counter
    const counterObj = { value: 0 };
    gsap.to(counterObj, {
      value: normalizedScore,
      duration: isMobile() ? 1 : 1.5,
      ease: 'power2.out',
      delay: 0.2,
      onUpdate: () => {
        if (scoreRef.current) {
          scoreRef.current.textContent = Math.round(counterObj.value).toString();
        }
      },
    });

    // Add a subtle pulse effect if score is high
    if (normalizedScore > 66 && gaugeRef.current) {
      gsap.to(gaugeRef.current, {
        opacity: 0.8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [normalizedScore, isMobile]);

  // Add hover glow effect on desktop
  useEffect(() => {
    if (prefersReducedMotion() || isMobile() || !gaugeRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(arcRef.current, {
        filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(arcRef.current, {
        filter: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const svg = gaugeRef.current;
    svg.addEventListener('mouseenter', handleMouseEnter);
    svg.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      svg.removeEventListener('mouseenter', handleMouseEnter);
      svg.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={gaugeRef}
        width={config.width}
        height={config.height}
        className="overflow-visible cursor-pointer"
      >
        <defs>
          <linearGradient id={`gauge-gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>
          
          {/* Glow filter for high-risk scores */}
          {normalizedScore > 66 && (
            <filter id={`glow-${score}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />

        {/* Filled arc with animation */}
        <path
          ref={arcRef}
          d={filledPath}
          fill="none"
          stroke={`url(#gauge-gradient-${score})`}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          filter={normalizedScore > 66 ? `url(#glow-${score})` : undefined}
        />

        {/* Score text with counter animation */}
        <text
          ref={scoreRef}
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className={`${config.fontSize} font-bold fill-white`}
        >
          0
        </text>

        {/* Small label under score */}
        <text
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          className="text-xs fill-gray-400"
        >
          /100
        </text>
      </svg>

      {showLabel && (
        <div className={`mt-2 flex items-center gap-2 ${config.labelSize}`}>
          <div
            className={`w-2 h-2 rounded-full ${risk.bgColor} ${
              normalizedScore > 66 ? 'animate-pulse-glow' : ''
            }`}
          />
          <span className={`font-semibold ${risk.color}`}>{risk.level} Risk</span>
        </div>
      )}
    </div>
  );
}
