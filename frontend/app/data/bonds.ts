export interface Bond {
  id?: string;
  _id?: string;  // MongoDB ObjectId
  name: string;
  issuer: string;
  returnRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore?: number;  // AI-generated risk score 0-100
  price: number;
  maturityYears: number;
  description: string;
  sector: string;
  totalValue?: number;
  availableUnits?: number;
  launchDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Helper to get bond ID (handles both MongoDB _id and regular id)
export const getBondId = (bond: Bond): string => {
  return bond._id || bond.id || '';
};

// API base URL
export const API_BASE_URL = 'http://localhost:3210';

// Fetch all bonds from API
export async function fetchBonds(): Promise<Bond[]> {
  const response = await fetch(`${API_BASE_URL}/api/bonds`);
  if (!response.ok) {
    throw new Error('Failed to fetch bonds');
  }
  const result = await response.json();
  return result.data;
}

// Fetch single bond by ID
export async function fetchBondById(id: string): Promise<Bond> {
  const response = await fetch(`${API_BASE_URL}/api/bonds/${id}`);
  if (!response.ok) {
    throw new Error('Bond not found');
  }
  const result = await response.json();
  return result.data;
}

// Keep sample bonds for fallback/testing
export const sampleBonds: Bond[] = [
  {
    id: '1',
    name: 'National Highway Infrastructure Bond',
    issuer: 'NHAI',
    returnRate: 7.5,
    riskLevel: 'Low',
    price: 10000,
    maturityYears: 5,
    description: 'Government-backed infrastructure bond for national highway development',
    sector: 'Transportation'
  },
  {
    id: '2',
    name: 'Metro Rail Development Bond',
    issuer: 'DMRC',
    returnRate: 8.2,
    riskLevel: 'Low',
    price: 25000,
    maturityYears: 7,
    description: 'Fund expansion of metro rail networks in major cities',
    sector: 'Urban Transit'
  },
  {
    id: '3',
    name: 'Green Energy Infrastructure Bond',
    issuer: 'IREDA',
    returnRate: 9.0,
    riskLevel: 'Medium',
    price: 15000,
    maturityYears: 10,
    description: 'Supporting renewable energy infrastructure projects across India',
    sector: 'Energy'
  },
  {
    id: '4',
    name: 'Smart City Development Bond',
    issuer: 'Smart City SPV',
    returnRate: 8.8,
    riskLevel: 'Medium',
    price: 20000,
    maturityYears: 8,
    description: 'Financing smart city initiatives including digital infrastructure',
    sector: 'Urban Development'
  },
  {
    id: '5',
    name: 'Port & Logistics Bond',
    issuer: 'Sagarmala SPV',
    returnRate: 9.5,
    riskLevel: 'High',
    price: 50000,
    maturityYears: 12,
    description: 'Investment in port modernization and coastal economic zones',
    sector: 'Maritime'
  }
];
