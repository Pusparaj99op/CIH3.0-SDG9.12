import Link from 'next/link';
import { Bond, getBondId } from '../data/bonds';

interface BondCardProps {
  bond: Bond;
}

const getRiskColor = (riskLevel: Bond['riskLevel']) => {
  switch (riskLevel) {
    case 'Low':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'High':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

const getRiskIcon = (riskLevel: Bond['riskLevel']) => {
  switch (riskLevel) {
    case 'Low':
      return '🛡️';
    case 'Medium':
      return '⚖️';
    case 'High':
      return '🔥';
  }
};

export default function BondCard({ bond }: BondCardProps) {
  const bondId = getBondId(bond);

  return (
    <Link href={`/bonds/${bondId}`} className="block">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
              {bond.name}
            </h3>
            <p className="text-blue-300 text-sm">{bond.issuer}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(bond.riskLevel)}`}>
            {getRiskIcon(bond.riskLevel)} {bond.riskLevel}
          </span>
        </div>

        {/* Sector Tag */}
        <div className="mb-4">
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
            {bond.sector}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Return Rate</p>
            <p className="text-green-400 text-xl font-bold">{bond.returnRate}%</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Risk Score</p>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-bold ${
                (bond.riskScore || 50) <= 33 ? 'text-green-400' :
                (bond.riskScore || 50) <= 66 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {bond.riskScore || 50}
              </p>
              <span className="text-gray-500 text-xs">/100</span>
            </div>
          </div>
        </div>

        {/* Maturity */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Maturity</span>
            <span className="text-white font-medium">{bond.maturityYears} Years</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div>
            <p className="text-gray-400 text-xs">Min. Investment</p>
            <p className="text-white text-lg font-semibold">
              ₹{bond.price.toLocaleString('en-IN')}
            </p>
          </div>
          <span className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
