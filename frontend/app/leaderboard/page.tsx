'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { animateCounter, prefersReducedMotion } from '@/lib/animations';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  percentageReturn: number;
  bondsOwned: number;
  rank: number;
  memberSince: string;
}

interface LeaderboardStats {
  totalTraders: number;
  avgReturn: number;
  topReturn: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const statsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3210/api/leaderboard?page=${currentPage}&limit=20`);
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data.leaderboard);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    if (rank === 2) return { emoji: '🥈', color: 'text-gray-300', bg: 'bg-gray-500/10' };
    if (rank === 3) return { emoji: '🥉', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { emoji: `#${rank}`, color: 'text-gray-400', bg: '' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Animate stats counters
  useGSAP(() => {
    if (statsRef.current && stats && !prefersReducedMotion()) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number');
      statNumbers.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-value') || '0');
        animateCounter(el as HTMLElement, 0, target, 1.5);
      });
    }
  }, [stats]);

  // Animate leaderboard rows and medals
  useGSAP(() => {
    if (tableRef.current && leaderboard.length && !prefersReducedMotion()) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );

      // Add glow and scale to top 3 medals
      const medals = tableRef.current.querySelectorAll('.medal');
      medals.forEach((medal, idx) => {
        if (idx < 3) {
          gsap.to(medal, {
            scale: 1.1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.3 + idx * 0.1
          });
        }
      });
    }
  }, [leaderboard, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
              <p className="text-blue-200 mt-1">Top traders ranked by returns</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        {stats && (
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass border border-white/20 rounded-xl p-6">
              <div className="text-blue-200 text-sm mb-2">Total Traders</div>
              <div className="stat-number text-3xl font-bold text-white" data-value={stats.totalTraders}>0</div>
            </div>
            <div className="glass border border-white/20 rounded-xl p-6">
              <div className="text-blue-200 text-sm mb-2">Average Return</div>
              <div className={`stat-number text-3xl font-bold ${stats.avgReturn >= 0 ? 'text-green-400' : 'text-red-400'}`} data-value={stats.avgReturn}>
                0%
              </div>
            </div>
            <div className="glass border border-white/20 rounded-xl p-6">
              <div className="text-blue-200 text-sm mb-2">Top Return</div>
              <div className={`stat-number text-3xl font-bold ${stats.topReturn >= 0 ? 'text-green-400' : 'text-red-400'}`} data-value={stats.topReturn}>
                0%
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-lg">No traders found</p>
              <p className="text-blue-200 mt-2">Be the first to start trading!</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table ref={tableRef} className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Trader
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Returns
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Invested
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Bonds
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Member Since
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {leaderboard.map((entry) => {
                      const rankStyle = getRankDisplay(entry.rank);
                      return (
                        <tr
                          key={entry.userId}
                          className={`hover:bg-white/5 transition-colors ${rankStyle.bg}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`medal text-2xl font-bold ${rankStyle.color} ${entry.rank <= 3 ? 'glow-' + (entry.rank === 1 ? 'yellow' : entry.rank === 2 ? 'gray' : 'orange') : ''}`}>
                              {rankStyle.emoji}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-white font-medium">{entry.userName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-lg font-bold ${entry.percentageReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {entry.percentageReturn >= 0 ? '+' : ''}{entry.percentageReturn}%
                            </div>
                            <div className={`text-sm ${entry.totalReturns >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                              {entry.totalReturns >= 0 ? '+' : ''}{formatCurrency(entry.totalReturns)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-white">{formatCurrency(entry.totalInvested)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-white font-medium">{formatCurrency(entry.currentValue)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-blue-200">{entry.bondsOwned}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-blue-200 text-sm">{formatDate(entry.memberSince)}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-white/10">
                {leaderboard.map((entry) => {
                  const rankStyle = getRankDisplay(entry.rank);
                  return (
                    <div key={entry.userId} className={`p-4 ${rankStyle.bg}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl font-bold ${rankStyle.color}`}>
                            {rankStyle.emoji}
                          </div>
                          <div>
                            <div className="text-white font-medium">{entry.userName}</div>
                            <div className="text-blue-200 text-sm">
                              {entry.bondsOwned} bonds • Since {formatDate(entry.memberSince)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-blue-200 text-xs mb-1">Returns</div>
                          <div className={`text-lg font-bold ${entry.percentageReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.percentageReturn >= 0 ? '+' : ''}{entry.percentageReturn}%
                          </div>
                          <div className={`text-xs ${entry.totalReturns >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {entry.totalReturns >= 0 ? '+' : ''}{formatCurrency(entry.totalReturns)}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-200 text-xs mb-1">Invested</div>
                          <div className="text-white font-medium">{formatCurrency(entry.totalInvested)}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-blue-200 text-xs mb-1">Current Value</div>
                          <div className="text-white font-medium">{formatCurrency(entry.currentValue)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-t border-white/10">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-blue-200">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
