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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Infrastructure Bonds
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start with these high-performing bonds from trusted issuers
            </p>
          </div>

          {bondsLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Loading bonds...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {bonds.map((bond) => (
                <BondCard key={getBondId(bond)} bond={bond} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/bonds"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
            >
              View All Bonds
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border-y border-orange-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Infrastructure Portfolio?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join hundreds of investors already earning steady returns from India&apos;s growth story. Start with ₹10,00,000 virtual money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/50 text-lg"
            >
              Start Investing Now
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🏦</span>
                <span className="text-2xl font-bold text-white">Mudra</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Democratizing infrastructure investment through blockchain technology.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/bonds" className="text-white/60 hover:text-white transition-colors text-sm">Browse Bonds</Link></li>
                <li><Link href="/dashboard" className="text-white/60 hover:text-white transition-colors text-sm">Dashboard</Link></li>
                <li><Link href="/portfolio" className="text-white/60 hover:text-white transition-colors text-sm">Portfolio</Link></li>
                <li><Link href="/dashboard/transactions" className="text-white/60 hover:text-white transition-colors text-sm">Transactions</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-white/60 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">How It Works</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Support</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Disclaimer</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Risk Warning</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50 text-sm">
                © 2026 Mudra. Built for CIH 3.0 - SDG 9 | Team Co Devians
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="GitHub">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
