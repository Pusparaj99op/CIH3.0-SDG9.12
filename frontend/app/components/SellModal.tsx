'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import gsap from 'gsap';
import { prefersReducedMotion, getAnimDuration } from '@/lib/animations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/api';

interface Holding {
  id: string;
  bond: {
    id: string;
    name: string;
    issuer: string;
    currentPrice: number;
    returnRate: number;
    riskLevel: string;
    sector: string;
  } | null;
  quantity: number;
  averageBuyPrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  percentageReturn: number;
}

interface SellModalProps {
  holding: Holding;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SellModal({ holding, isOpen, onClose, onSuccess }: SellModalProps) {
  const { token, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !prefersReducedMotion()) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: getAnimDuration(0.3), ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: getAnimDuration(0.4), ease: 'back.out(1.4)', delay: 0.1 }
      );
    }
  }, [isOpen]);

  if (!isOpen || !holding.bond) return null;

  const bond = holding.bond;
  const maxQuantity = holding.quantity;
  const totalValue = bond.currentPrice * quantity;
  const profitLoss = (bond.currentPrice - holding.averageBuyPrice) * quantity;
  const percentReturn = ((bond.currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice * 100).toFixed(2);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleSell = async () => {
    if (quantity < 1 || quantity > maxQuantity) {
      showToast('Invalid quantity', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/paper-trading/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bondId: bond.id,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        if (modalRef.current && !prefersReducedMotion()) {
          gsap.to(modalRef.current, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          });
        }
        showToast(`Successfully sold ${quantity} unit(s) of ${bond.name}`, 'success');
        await refreshUser();
        onSuccess();
        onClose();
      } else {
        showToast(data.message || 'Failed to sell', 'error');
      }
    } catch (error) {
      console.error('Sell error:', error);
      showToast('Failed to process sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Modal */}
      <div ref={modalRef} className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📤</span>
            <h2 className="text-xl font-bold text-white">Sell Bond</h2>
          </div>
          <p className="text-gray-400 text-sm">Sell your holdings for instant credit</p>
        </div>

        {/* Bond Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-1">{bond.name}</h3>
          <p className="text-gray-400 text-sm mb-3">{bond.issuer}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Current Price</p>
              <p className="text-white font-semibold">{formatCurrency(bond.currentPrice)}</p>
            </div>
            <div>
              <p className="text-gray-500">Your Avg Price</p>
              <p className="text-white font-semibold">{formatCurrency(holding.averageBuyPrice)}</p>
            </div>
            <div>
              <p className="text-gray-500">Holdings</p>
              <p className="text-white font-semibold">{holding.quantity} units</p>
            </div>
            <div>
              <p className="text-gray-500">Total P&L</p>
              <p className={`font-semibold ${holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {holding.profitLoss >= 0 ? '+' : ''}{formatCurrency(holding.profitLoss)}
              </p>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">
            Quantity to Sell
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min={1}
              max={maxQuantity}
              aria-label="Quantity to sell"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
              className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => setQuantity(1)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Min
            </button>
            <span className="text-xs text-gray-500">Max: {maxQuantity}</span>
            <button
              onClick={() => setQuantity(maxQuantity)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Max
            </button>
          </div>
        </div>

        {/* Sale Summary */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Sale Amount</span>
            <span className="text-xl font-bold text-green-400">{formatCurrency(totalValue)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-gray-400">Profit/Loss</span>
            <span className={`font-semibold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)} ({profitLoss >= 0 ? '+' : ''}{percentReturn}%)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            disabled={loading || quantity < 1 || quantity > maxQuantity}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Selling...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Confirm Sell</span>
              </>
            )}
          </button>
        </div>

        {/* Instant Credit Notice */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Sale amount will be credited to your wallet instantly
        </p>
      </div>
    </div>
  );
}
