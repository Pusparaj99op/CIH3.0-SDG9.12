'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import SellModal from '../components/SellModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/api';

interface Holding {
  id: string;
  bond: {
    id: string;
    name: string;
    issuer: string;
    currentPrice: number;
    returnRate: number;
    riskLevel: string;
    sector: string;
  } | null;
  quantity: number;
  averageBuyPrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  percentageReturn: number;
}

interface Portfolio {
  holdings: Holding[];
  totalInvested: number;
  totalBondsOwned: number;
  currentValue: number;
  totalReturns: number;
  percentageReturn: number;
  expectedAnnualReturns: number;
}

interface Transaction {
  _id: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  createdAt: string;
  bond: {
    name: string;
    issuer: string;
  };
}

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioContent />
    </ProtectedRoute>
  );
}

function PortfolioContent() {
  const { user, token, refreshUser } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, [token]);

  const fetchPortfolio = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/portfolio`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setPortfolio(data.data.portfolio);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load portfolio');
      console.error('Portfolio error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/portfolio/transactions?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data.transactions);
      }
    } catch (err) {
      console.error('Transactions error:', err);
    }
  };

  const handleSellClick = (holding: Holding) => {
    setSelectedHolding(holding);
    setShowSellModal(true);
  };

  const handleSellSuccess = () => {
    fetchPortfolio();
    fetchTransactions();
    refreshUser();
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
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-gray-400">Track your bond investments and returns</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-gray-400 text-sm">Wallet Balance</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(user?.wallet?.balance || 0)}
            </p>
          </div>

          {/* Invested Amount */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <span className="text-gray-400 text-sm">Total Invested</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency(portfolio?.totalInvested || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{portfolio?.totalBondsOwned || 0} bonds</p>
          </div>

          {/* Current Value */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <span className="text-gray-400 text-sm">Current Value</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(portfolio?.currentValue || 0)}
            </p>
            {portfolio && portfolio.totalReturns !== 0 && (
              <p className={`text-xs mt-1 ${portfolio.totalReturns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolio.totalReturns >= 0 ? '+' : ''}{formatCurrency(portfolio.totalReturns)} ({portfolio.percentageReturn}%)
              </p>
            )}
          </div>

          {/* Expected Returns */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <span className="text-gray-400 text-sm">Expected Annual</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              {formatCurrency(portfolio?.expectedAnnualReturns || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">per year</p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">My Holdings</h2>
            <Link
              href="/bonds"
              className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
            >
              <span>+ Add More</span>
            </Link>
          </div>

          {portfolio && portfolio.holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                    <th className="pb-4 pr-4">Bond</th>
                    <th className="pb-4 pr-4">Qty</th>
                    <th className="pb-4 pr-4">Avg Price</th>
                    <th className="pb-4 pr-4">Invested</th>
                    <th className="pb-4 pr-4">Current Value</th>
                    <th className="pb-4 pr-4">P&L</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding) => (
                    <tr key={holding.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 pr-4">
                        <div>
                          <p className="text-white font-medium">{holding.bond?.name}</p>
                          <p className="text-gray-500 text-sm">{holding.bond?.issuer}</p>
                          <span className={`text-xs ${getRiskColor(holding.bond?.riskLevel || '')}`}>
                            {holding.bond?.riskLevel} Risk
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-white">{holding.quantity}</td>
                      <td className="py-4 pr-4 text-white">{formatCurrency(holding.averageBuyPrice)}</td>
                      <td className="py-4 pr-4 text-white">{formatCurrency(holding.totalInvested)}</td>
                      <td className="py-4 pr-4 text-white">{formatCurrency(holding.currentValue)}</td>
                      <td className="py-4 pr-4">
                        <div>
                          <p className={holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {holding.profitLoss >= 0 ? '+' : ''}{formatCurrency(holding.profitLoss)}
                          </p>
                          <p className={`text-xs ${holding.percentageReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ({holding.percentageReturn >= 0 ? '+' : ''}{holding.percentageReturn}%)
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/bonds/${holding.bond?.id}`}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleSellClick(holding)}
                            className="text-sm text-red-400 hover:text-red-300 font-medium"
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏦</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No investments yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Start building your portfolio by investing in infrastructure bonds.
              </p>
              <Link
                href="/bonds"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
              >
                <span>Explore Bonds</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>

          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <span className="text-xl">{tx.type === 'BUY' ? '📥' : '📤'}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {tx.type === 'BUY' ? 'Bought' : 'Sold'} {tx.quantity} unit(s)
                      </p>
                      <p className="text-gray-400 text-sm">{tx.bond?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'BUY' ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.totalAmount)}
                    </p>
                    <p className="text-gray-500 text-xs">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          )}
        </div>

        {/* Paper Trading Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-blue-300 font-semibold mb-1">Paper Trading Mode</h3>
              <p className="text-blue-200/70 text-sm">
                You&apos;re using virtual money for paper trading. This is a simulation environment
                to help you learn about bond investments without any real financial risk.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sell Modal */}
      {selectedHolding && (
        <SellModal
          holding={selectedHolding}
          isOpen={showSellModal}
          onClose={() => {
            setShowSellModal(false);
            setSelectedHolding(null);
          }}
          onSuccess={handleSellSuccess}
        />
      )}
    </div>
  );
}
