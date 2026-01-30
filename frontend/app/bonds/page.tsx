'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BondCard from '../components/BondCard';
import { Bond, fetchBonds, getBondId } from '../data/bonds';

export default function BondsPage() {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [filteredBonds, setFilteredBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');

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

  // Apply filters
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
    
    setFilteredBonds(result);
  }, [bonds, searchQuery, riskFilter, sectorFilter]);

  // Get unique sectors
  const sectors = [...new Set(bonds.map(b => b.sector))];

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
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name or issuer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              
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
            </div>
            
            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Showing {filteredBonds.length} of {bonds.length} bonds
              </span>
              {(searchQuery || riskFilter !== 'all' || sectorFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRiskFilter('all');
                    setSectorFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBonds.map((bond) => (
                    <BondCard key={getBondId(bond)} bond={bond} />
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
