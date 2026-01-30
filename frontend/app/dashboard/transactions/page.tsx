'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  bond: {
    id?: string;
    name: string;
    issuer: string;
    currentPrice?: number;
    returnRate: number;
    riskLevel: string;
    sector?: string;
  } | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Summary {
  totalTransactions: number;
  buyCount: number;
  sellCount: number;
  totalBuyAmount: number;
  totalSellAmount: number;
  netFlow: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async (page: number = 1, type: string = 'ALL') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view transactions');
        return;
      }

      let url = `http://localhost:3210/api/transactions?page=${page}&limit=10`;
      if (type !== 'ALL') {
        url += `&type=${type}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTransactions(data.data.transactions);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, typeFilter);
  }, [currentPage, typeFilter]);

  const handleFilterChange = (newType: string) => {
    setTypeFilter(newType);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white/70 text-lg">Loading transactions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-white/60 mt-1">View all your buy and sell transactions</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <p className="text-white/60 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{summary.totalTransactions}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <p className="text-white/60 text-sm">Buy Orders</p>
              <p className="text-2xl font-bold text-green-400">{summary.buyCount}</p>
              <p className="text-sm text-white/50">{formatCurrency(summary.totalBuyAmount)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <p className="text-white/60 text-sm">Sell Orders</p>
              <p className="text-2xl font-bold text-red-400">{summary.sellCount}</p>
              <p className="text-sm text-white/50">{formatCurrency(summary.totalSellAmount)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <p className="text-white/60 text-sm">Net Investment</p>
              <p className={`text-2xl font-bold ${summary.netFlow >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                {formatCurrency(summary.netFlow)}
              </p>
            </div>
          </div>
        )}

        {/* Filter and Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="type-filter" className="text-white/70 text-sm">Filter by Type:</label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL" className="bg-slate-800">All Transactions</option>
                <option value="BUY" className="bg-slate-800">Buy Only</option>
                <option value="SELL" className="bg-slate-800">Sell Only</option>
              </select>
            </div>
            {pagination && (
              <p className="text-white/60 text-sm">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border-b border-red-500/30">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Table */}
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-white/50 text-lg">No transactions found</p>
              <Link href="/bonds" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
                Browse bonds to make your first investment →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/70 font-medium whitespace-nowrap">Date & Time</th>
                      <th className="text-left p-4 text-white/70 font-medium whitespace-nowrap min-w-[200px]">Bond</th>
                      <th className="text-center p-4 text-white/70 font-medium whitespace-nowrap">Type</th>
                      <th className="text-right p-4 text-white/70 font-medium whitespace-nowrap">Quantity</th>
                      <th className="text-right p-4 text-white/70 font-medium whitespace-nowrap">Price/Unit</th>
                      <th className="text-right p-4 text-white/70 font-medium whitespace-nowrap">Total Amount</th>
                      <th className="text-center p-4 text-white/70 font-medium whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 whitespace-nowrap">
                          <span className="text-white text-sm">{formatDate(tx.createdAt)}</span>
                        </td>
                        <td className="p-4">
                          {tx.bond ? (
                            <div>
                              <p className="text-white font-medium whitespace-nowrap">{tx.bond.name}</p>
                              <p className="text-white/50 text-sm whitespace-nowrap">{tx.bond.issuer}</p>
                            </div>
                          ) : (
                            <span className="text-white/50">Bond not available</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            tx.type === 'BUY'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.type === 'BUY' ? '↓ BUY' : '↑ SELL'}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <span className="text-white">{tx.quantity}</span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <span className="text-white/80">{formatCurrency(tx.pricePerUnit)}</span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <span className={`font-semibold ${
                          tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.totalAmount)}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          tx.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : tx.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasPrevPage
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                  // Show limited page numbers
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-white/50">...</span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasNextPage
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
