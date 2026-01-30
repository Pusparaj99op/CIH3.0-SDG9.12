'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import BondCard from './components/BondCard';
import { Bond, fetchBonds, getBondId } from './data/bonds';

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
}

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [bondsLoading, setBondsLoading] = useState(true);

  useEffect(() => {
    // Check backend health
    fetch('http://localhost:3210/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(() => setHealth(null));

    // Fetch bonds
    fetchBonds()
      .then(data => setBonds(data.slice(0, 6))) // Show only 6 featured bonds
      .catch(() => setBonds([]))
      .finally(() => setBondsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
              {health ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">System Online</span>
                </>
              ) : (
                <span className="text-yellow-400 text-sm font-medium">Connecting...</span>
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Invest in India&apos;s
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Infrastructure Future
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
              Tokenized infrastructure bonds democratizing access to India&apos;s growth story. 
              Secure, transparent, and powered by blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/50"
              >
                Get Started Free
              </Link>
              <Link
                href="/bonds"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-sm"
              >
                Explore Bonds →
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Blockchain Secured
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Government Backed
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transparent Returns
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">₹50Cr+</div>
              <div className="text-white/60">Total Investment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">10+</div>
              <div className="text-white/60">Active Bonds</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-white/60">Investors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">8.5%</div>
              <div className="text-white/60">Avg. Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Mudra?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Built for the modern investor with cutting-edge technology and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-yellow-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Blockchain Powered</h3>
              <p className="text-white/60 leading-relaxed">
                Every bond is tokenized on blockchain, ensuring transparency, security, and immutability of your investments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Government Backed</h3>
              <p className="text-white/60 leading-relaxed">
                Invest in infrastructure bonds backed by government projects - railways, highways, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Real-time Analytics</h3>
              <p className="text-white/60 leading-relaxed">
                Track your portfolio with live updates, detailed analytics, and AI-powered risk assessments.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Low Entry Barrier</h3>
              <p className="text-white/60 leading-relaxed">
                Start investing with as little as ₹10,000. No need for crores to access infrastructure bonds.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-orange-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Diversify Portfolio</h3>
              <p className="text-white/60 leading-relaxed">
                Access multiple sectors - transport, energy, urban infrastructure - all in one platform.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-cyan-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Paper Trading</h3>
              <p className="text-white/60 leading-relaxed">
                Practice with virtual money before investing real funds. Perfect for beginners to learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Three simple steps to start investing in India&apos;s infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Create Account</h3>
                <p className="text-white/70 leading-relaxed">
                  Sign up in seconds with just your email. Get ₹10,00,000 virtual money to start paper trading immediately.
                </p>
              </div>
              {/* Connector Arrow - hidden on mobile */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-yellow-500 to-green-500"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Browse Bonds</h3>
                <p className="text-white/70 leading-relaxed">
                  Explore 10+ infrastructure bonds across sectors. View detailed analytics, risk scores, and AI insights.
                </p>
              </div>
              {/* Connector Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Start Investing</h3>
              <p className="text-white/70 leading-relaxed">
                Buy bonds with a click. Track portfolio in real-time. Sell anytime with transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bonds Section */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              Featured Bonds
            </h2>
            <span className="text-blue-300 text-sm">
              {bonds.length} bonds available
            </span>
          </div>

          {/* Loading State */}
          {bondsLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-200">Loading bonds...</p>
            </div>
          )}

          {/* Error State */}
          {!bondsLoading && bondsError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8 text-center">
              <p className="text-red-400 text-lg mb-4">{bondsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Bonds Grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
          {!bondsLoading && !bondsError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bonds.map((bond) => (
                <BondCard key={getBondId(bond)} bond={bond} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!bondsLoading && !bondsError && bonds.length === 0 && (
            <div className="bg-white/5 rounded-xl p-8 text-center">
              <p className="text-gray-400">No bonds available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>CIH 3.0 - SDG 9 | Team Co Devians</p>
          <p className="mt-2">Infrastructure Bond Tokenization Platform</p>
        </div>
      </footer>
    </div>
  );
}
