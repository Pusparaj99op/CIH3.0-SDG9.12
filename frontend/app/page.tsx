'use client';

import { useState, useEffect } from 'react';
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
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [bonds, setBonds] = useState<Bond[]>([]);
  const [bondsLoading, setBondsLoading] = useState(true);
  const [bondsError, setBondsError] = useState<string | null>(null);

  // Check backend health
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('http://localhost:3210/api/health');
        if (!response.ok) {
          throw new Error('Backend not responding');
        }
        const data = await response.json();
        setHealth(data);
        setHealthError(null);
      } catch (err) {
        setHealthError('Unable to connect to backend');
        setHealth(null);
      } finally {
        setHealthLoading(false);
      }
    };

    checkBackendHealth();
  }, []);

  // Fetch bonds from API
  useEffect(() => {
    const loadBonds = async () => {
      try {
        setBondsLoading(true);
        const data = await fetchBonds();
        setBonds(data);
        setBondsError(null);
      } catch (err) {
        setBondsError('Failed to load bonds. Please try again later.');
        setBonds([]);
      } finally {
        setBondsLoading(false);
      }
    };

    loadBonds();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏦 Invest in India&apos;s Infrastructure
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Tokenized infrastructure bonds for everyone. Secure, transparent, and accessible.
          </p>

          {/* Connection Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-8">
            {healthLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-200 text-sm">Connecting to backend...</span>
              </>
            ) : health ? (
              <>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Backend Connected</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-red-400 text-sm">{healthError}</span>
              </>
            )}
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
