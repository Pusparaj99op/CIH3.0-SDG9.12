'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import BuyModal from '../../components/BuyModal';
import RiskGauge from '../../components/RiskGauge';
import { Bond, fetchBondById, getBondId } from '../../data/bonds';
import { useAuth } from '../../context/AuthContext';

export default function BondDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [bond, setBond] = useState<Bond | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const loadBond = async () => {
    try {
      setLoading(true);
      const id = params.id as string;
      const data = await fetchBondById(id);
      setBond(data);
      setError(null);
    } catch (err) {
      setError('Bond not found');
      setBond(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadBond();
    }
  }, [params.id]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '🛡️';
      case 'Medium': return '⚖️';
      case 'High': return '🔥';
      default: return '📊';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return formatCurrency(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navbar />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Bonds
          </button>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-200 text-lg">Loading bond details...</p>
            </div>
          )}

          {/* Error State / 404 */}
          {!loading && error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-white mb-2">Bond Not Found</h2>
              <p className="text-red-300 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Browse All Bonds
              </Link>
            </div>
          )}

          {/* Bond Details */}
          {!loading && bond && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {bond.sector}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(bond.riskLevel)}`}>
                        {getRiskIcon(bond.riskLevel)} {bond.riskLevel} Risk
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{bond.name}</h1>
                    <p className="text-blue-300 text-lg">Issued by {bond.issuer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Return Rate</p>
                    <p className="text-4xl font-bold text-green-400">{bond.returnRate}%</p>
                    <p className="text-gray-400 text-sm">per annum</p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">{bond.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                  <p className="text-gray-400 text-sm mb-2">Min. Investment</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(bond.price)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                  <p className="text-gray-400 text-sm mb-2">Maturity Period</p>
                  <p className="text-2xl font-bold text-white">{bond.maturityYears} Years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                  <p className="text-gray-400 text-sm mb-2">Total Value</p>
                  <p className="text-2xl font-bold text-white">{bond.totalValue ? formatLargeNumber(bond.totalValue) : 'N/A'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                  <p className="text-gray-400 text-sm mb-2">Available Units</p>
                  <p className="text-2xl font-bold text-white">{bond.availableUnits?.toLocaleString('en-IN') || 'N/A'}</p>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">AI Risk Assessment</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <RiskGauge score={bond.riskScore || 50} size="lg" />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Issuer Credibility</span>
                        <span className="text-green-400 font-semibold">High</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Market Stability</span>
                        <span className="text-yellow-400 font-semibold">Moderate</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Sector Growth</span>
                        <span className="text-blue-400 font-semibold">Positive</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-[75%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-4 text-center">
                  * Risk assessment is generated by AI based on market data and issuer profile
                </p>
              </div>

              {/* Investment Calculator Preview */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Investment Calculator</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">If you invest</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(bond.price)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">After {bond.maturityYears} years</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(bond.price * Math.pow(1 + bond.returnRate / 100, bond.maturityYears))}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Returns</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatCurrency(bond.price * Math.pow(1 + bond.returnRate / 100, bond.maturityYears) - bond.price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsBuyModalOpen(true)}
                    className="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <span>🛒</span>
                    Buy Now
                  </button>
                ) : (
                  <Link
                    href={`/login?redirect=/bonds/${getBondId(bond)}`}
                    className="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <span>🔐</span>
                    Login to Buy
                  </Link>
                )}
                <button className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-lg font-semibold transition-colors border border-white/20">
                  Add to Watchlist
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Bond Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Bond ID</span>
                    <span className="text-white font-mono">{getBondId(bond)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Issuer</span>
                    <span className="text-white">{bond.issuer}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Sector</span>
                    <span className="text-white">{bond.sector}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Launch Date</span>
                    <span className="text-white">
                      {bond.launchDate ? new Date(bond.launchDate).toLocaleDateString('en-IN') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400">{bond.isActive !== false ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={bond.riskLevel === 'Low' ? 'text-green-400' : bond.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>
                      {bond.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>CIH 3.0 - SDG 9 | Team Co Devians</p>
        </div>
      </footer>

      {/* Buy Modal */}
      {bond && (
        <BuyModal
          bond={bond}
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
          onSuccess={() => loadBond()}
        />
      )}
    </div>
  );
}
