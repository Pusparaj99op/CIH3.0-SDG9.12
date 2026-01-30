'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(balance);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏦</span>
            <span className="text-xl font-bold text-white">Mudra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/bonds"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Bonds
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/portfolio"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
              </>
            )}

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-20 h-9 bg-white/10 rounded-lg animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Wallet Balance */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-400 text-sm">💰</span>
                  <span className="text-green-300 text-sm font-medium">
                    {formatBalance(user?.wallet?.balance || 0)}
                  </span>
                </div>
                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-sm">{user?.name}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Slide out from right */}
        <div className={`md:hidden fixed inset-y-0 right-0 w-64 bg-slate-900/95 backdrop-blur-lg border-l border-white/10 transform transition-transform duration-300 ease-in-out z-50 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                <span className="text-xl font-bold text-white">Mudra</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏠 Home
                </Link>
                <Link
                  href="/bonds"
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏛️ Bonds
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏆 Leaderboard
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/portfolio"
                      className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📈 Portfolio
                    </Link>
                    <Link
                      href="/dashboard/transactions"
                      className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📋 Transactions
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="text-gray-300 hover:text-white hover:bg-white/10 transition-all px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ⚙️ Profile & Settings
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="p-4 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-400 text-sm">💰</span>
                      <span className="text-green-300 text-xs">Wallet Balance</span>
                    </div>
                    <span className="text-green-300 text-lg font-bold">
                      {formatBalance(user?.wallet?.balance || 0)}
                    </span>
                  </div>
                  <div className="mb-3 p-3 bg-white/5 rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">Logged in as</div>
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-medium transition-colors border border-red-500/30"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium text-center border border-white/20 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-lg font-medium text-center transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
