'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Bond, getBondId } from '../data/bonds';
import { tilt3D, prefersReducedMotion, isMobile } from '@/lib/animations';

interface BondCardProps {
  bond: Bond;
}

const getRiskColor = (riskLevel: Bond['riskLevel']) => {
  switch (riskLevel) {
    case 'Low':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'High':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

const getRiskIcon = (riskLevel: Bond['riskLevel']) => {
  switch (riskLevel) {
    case 'Low':
      return '🛡️';
    case 'Medium':
      return '⚖️';
    case 'High':
      return '🔥';
  }
};

export default function BondCard({ bond }: BondCardProps) {
  const bondId = getBondId(bond);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add 3D tilt effect on desktop
    if (cardRef.current && !isMobile() && !prefersReducedMotion()) {
      tilt3D(cardRef.current, 10); // 10 degree max tilt
    }
  }, []);

  return (
    <Link href={`/bonds/${bondId}`} className="block">
      <div
        ref={cardRef}
        className="glass-strong rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer group preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                {bond.name}
              </h3>
              <p className="text-blue-300 text-sm group-hover:text-blue-200 transition-colors">
                {bond.issuer}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                bond.riskLevel
              )} group-hover:scale-110 transition-transform`}
            >
              {getRiskIcon(bond.riskLevel)} {bond.riskLevel}
            </span>
          </div>

          {/* Sector Tag */}
          <div className="mb-4">
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs group-hover:bg-purple-500/30 transition-colors">
              {bond.sector}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass rounded-lg p-3 group-hover:bg-white/10 transition-colors">
              <p className="text-gray-400 text-xs mb-1">Return Rate</p>
              <p className="text-green-400 text-xl font-bold group-hover:scale-110 inline-block transition-transform">
                {bond.returnRate}%
              </p>
            </div>
            <div className="glass rounded-lg p-3 group-hover:bg-white/10 transition-colors">
              <p className="text-gray-400 text-xs mb-1">Risk Score</p>
              <div className="flex items-center gap-2">
                <p
                  className={`text-xl font-bold ${
                    (bond.riskScore || 50) <= 33
                      ? 'text-green-400'
                      : (bond.riskScore || 50) <= 66
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  } group-hover:scale-110 inline-block transition-transform`}
                >
                  {bond.riskScore || 50}
                </p>
                <span className="text-gray-500 text-xs">/100</span>
              </div>
            </div>
          </div>

          {/* Maturity */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Maturity</span>
              <span className="text-white font-medium">{bond.maturityYears} Years</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div>
              <p className="text-gray-400 text-xs">Min. Investment</p>
              <p className="text-white text-lg font-semibold">
                ₹{bond.price.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/50">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
