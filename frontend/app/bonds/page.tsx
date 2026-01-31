'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import BondCard from '../components/BondCard';
import { Bond, fetchBonds, getBondId } from '../data/bonds';
import { scrollStagger, prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

type SortOption = 'returnRate-desc' | 'returnRate-asc' | 'price-desc' | 'price-asc' | 'name-asc' | 'name-desc';

export default function BondsPage() {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [filteredBonds, setFilteredBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [minReturn, setMinReturn] = useState<number>(0);
  const [maxReturn, setMaxReturn] = useState<number>(15);
  const [sortBy, setSortBy] = useState<SortOption>('returnRate-desc');

  // Fetch bonds
  useEffect(() => {
    const loadBonds = async () => {
      try {
        setLoading(true);
        const data = await fetchBonds();
        setBonds(data);
        setFilteredBonds(data);
        setError(null);
      } catch (err) {
        setError('Failed to load bonds');
        setBonds([]);
        setFilteredBonds([]);
      } finally {
        setLoading(false);
      }
    };
    loadBonds();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...bonds];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        bond =>
          bond.name.toLowerCase().includes(query) ||
          bond.issuer.toLowerCase().includes(query)
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      result = result.filter(bond => bond.riskLevel === riskFilter);
    }

    // Sector filter
    if (sectorFilter !== 'all') {
      result = result.filter(bond => bond.sector === sectorFilter);
    }

    // Return range filter
    result = result.filter(bond =>
      bond.returnRate >= minReturn && bond.returnRate <= maxReturn
    );

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'returnRate-desc':
          return b.returnRate - a.returnRate;
        case 'returnRate-asc':
          return a.returnRate - b.returnRate;
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredBonds(result);
  }, [bonds, searchQuery, riskFilter, sectorFilter, minReturn, maxReturn, sortBy]);

  // Get unique sectors
  const sectors = [...new Set(bonds.map(b => b.sector))];

  // Get min/max return rates from data
  const returnRates = bonds.map(b => b.returnRate);
  const dataMinReturn = Math.floor(Math.min(...returnRates, 0));
  const dataMaxReturn = Math.ceil(Math.max(...returnRates, 15));

  const clearFilters = () => {
    setSearchQuery('');
    setRiskFilter('all');
    setSectorFilter('all');
    setMinReturn(dataMinReturn);
    setMaxReturn(dataMaxReturn);
    setSortBy('returnRate-desc');
  };

  const hasActiveFilters = searchQuery || riskFilter !== 'all' || sectorFilter !== 'all' ||
    minReturn > dataMinReturn || maxReturn < dataMaxReturn || sortBy !== 'returnRate-desc';

  // Animate bond grid on load and filter changes
  useGSAP(() => {
    if (gridRef.current && !loading && !prefersReducedMotion()) {
      scrollStagger(gridRef.current, '.bond-card-item', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }, [filteredBonds, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navbar />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Browse Bonds</h1>
            <p className="text-blue-200">Discover infrastructure investment opportunities</p>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            {/* Row 1: Search and Sort */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or issuer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort bonds"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="returnRate-desc" className="bg-gray-800">📈 Highest Return First</option>
                  <option value="returnRate-asc" className="bg-gray-800">📉 Lowest Return First</option>
                  <option value="price-desc" className="bg-gray-800">💰 Highest Price First</option>
                  <option value="price-asc" className="bg-gray-800">💵 Lowest Price First</option>
                  <option value="name-asc" className="bg-gray-800">🔤 Name A-Z</option>
                  <option value="name-desc" className="bg-gray-800">🔤 Name Z-A</option>
                </select>
              </div>
            </div>

            {/* Row 2: Risk, Sector, Return Range */}
            <div className="grid md:grid-cols-4 gap-4">
              {/* Risk Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Risk Level</label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  aria-label="Filter by risk level"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="all" className="bg-gray-800">All Risks</option>
                  <option value="Low" className="bg-gray-800">🛡️ Low</option>
                  <option value="Medium" className="bg-gray-800">⚖️ Medium</option>
                  <option value="High" className="bg-gray-800">🔥 High</option>
                </select>
              </div>

              {/* Sector Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Sector</label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  aria-label="Filter by sector"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="all" className="bg-gray-800">All Sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector} className="bg-gray-800">{sector}</option>
                  ))}
                </select>
              </div>

              {/* Return Range */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">
                  Return Rate: {minReturn}% - {maxReturn}%
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={dataMinReturn}
                    max={dataMaxReturn}
                    value={minReturn}
                    onChange={(e) => setMinReturn(Math.min(parseInt(e.target.value), maxReturn - 1))}
                    aria-label="Minimum return rate"
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="range"
                    min={dataMinReturn}
                    max={dataMaxReturn}
                    value={maxReturn}
                    onChange={(e) => setMaxReturn(Math.max(parseInt(e.target.value), minReturn + 1))}
                    aria-label="Maximum return rate"
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Showing {filteredBonds.length} of {bonds.length} bonds
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-200">Loading bonds...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8 text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Bonds Grid */}
          {!loading && !error && (
            <>
              {filteredBonds.length > 0 ? (
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBonds.map((bond) => (
                    <div key={getBondId(bond)} className="bond-card-item">
                      <BondCard bond={bond} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No bonds found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>CIH 3.0 - SDG 9 | Team Co Devians</p>
        </div>
      </footer>
    </div>
  );
}
