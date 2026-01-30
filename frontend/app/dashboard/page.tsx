'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues
const PortfolioAllocationChart = dynamic(
  () => import('../components/charts/PortfolioAllocationChart'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div> }
);

const PortfolioHistoryChart = dynamic(
  () => import('../components/charts/PortfolioHistoryChart'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div> }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/api';

interface Holding {
  bond: {
    name: string;
    sector: string;
  } | null;
  currentValue: number;
}

interface DashboardStats {
  totalInvested: number;
  totalReturns: number;
  bondsOwned: number;
  portfolioValue: number;
  holdings: Holding[];
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, token, refreshUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalInvested: 0,
    totalReturns: 0,
    bondsOwned: 0,
    portfolioValue: 0,
    holdings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
    fetchPortfolioStats();
  }, [refreshUser, token]);

  const fetchPortfolioStats = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/portfolio`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success && data.data.portfolio) {
        const portfolio = data.data.portfolio;
        setStats({
          totalInvested: portfolio.totalInvested || 0,
          totalReturns: portfolio.totalReturns || 0,
          bondsOwned: portfolio.totalBondsOwned || 0,
          portfolioValue: portfolio.currentValue || 0,
          holdings: portfolio.holdings || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch portfolio stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400">Here&apos;s your investment overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(user?.wallet?.balance || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(stats.portfolioValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Invested */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏦</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-purple-400">
                  {formatCurrency(stats.totalInvested)}
                </p>
              </div>
            </div>
          </div>

          {/* Bonds Owned */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📜</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Bonds Owned</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.bondsOwned}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Profile</h2>
              
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                <p className="text-gray-400">{user?.email}</p>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Member since</span>
                  <span className="text-white">{user?.createdAt ? formatDate(user.createdAt) : '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Account type</span>
                  <span className="text-yellow-400 capitalize">{user?.role || 'User'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Verification</span>
                  <span className={user?.isVerified ? 'text-green-400' : 'text-orange-400'}>
                    {user?.isVerified ? '✓ Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Portfolio Value History */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-lg font-bold text-white mb-4">Portfolio Value (30 Days)</h2>
                <PortfolioHistoryChart 
                  currentValue={stats.portfolioValue} 
                  totalInvested={stats.totalInvested}
                />
              </div>

              {/* Portfolio Allocation */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-lg font-bold text-white mb-4">Sector Allocation</h2>
                <PortfolioAllocationChart holdings={stats.holdings} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/bonds"
                  className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <span className="text-white font-medium">Browse Bonds</span>
                </Link>

                <Link
                  href="/portfolio"
                  className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📈</span>
                  </div>
                  <span className="text-white font-medium">My Portfolio</span>
                </Link>

                <div className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-xl border border-white/10 opacity-50 cursor-not-allowed">
                  <div className="w-14 h-14 bg-gray-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <span className="text-gray-400 font-medium">Transactions</span>
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Paper Trading Banner */}
            <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Paper Trading Mode Active</h3>
                  <p className="text-blue-200/70 text-sm">
                    You&apos;re trading with virtual money. Learn the markets risk-free! 
                    Your starting balance is ₹10,00,000.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
