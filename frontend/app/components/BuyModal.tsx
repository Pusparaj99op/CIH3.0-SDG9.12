'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bond } from '../data/bonds';
import gsap from 'gsap';
import { prefersReducedMotion, getAnimDuration } from '@/lib/animations';

interface BuyModalProps {
  bond: Bond;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/api';

export default function BuyModal({ bond, isOpen, onClose, onSuccess }: BuyModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, token, refreshUser } = useAuth();

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const availableUnits = bond.availableUnits || 10000;
  const totalCost = bond.price * quantity;
  const walletBalance = user?.wallet?.balance || 0;
  const canAfford = walletBalance >= totalCost;
  const maxAffordable = Math.floor(walletBalance / bond.price);
  const maxQuantity = Math.min(maxAffordable, availableUnits);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setError('');
      setSuccess('');

      // Animate modal entrance
      if (modalRef.current && backdropRef.current && !prefersReducedMotion()) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: getAnimDuration(0.3), ease: 'power2.out' }
        );

        gsap.fromTo(
          modalRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: getAnimDuration(0.4),
            ease: 'back.out(1.4)',
            delay: 0.1
          }
        );
      }
    }
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBuy = async () => {
    if (!canAfford || quantity < 1) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const bondId = bond._id || bond.id;
      const response = await fetch(`${API_URL}/paper-trading/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bondId, quantity })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);

        // Success animation
        if (modalRef.current && !prefersReducedMotion()) {
          gsap.to(modalRef.current, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          });
        }

        await refreshUser();
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Purchase failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Buy error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div ref={modalRef} className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Buy Bond</h2>
          <p className="text-gray-400">{bond.name}</p>
          <p className="text-sm text-gray-500">{bond.issuer}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
            <div className="flex items-center gap-2 text-green-300">
              <span className="text-xl">✓</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Bond Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Price per unit</p>
              <p className="text-white font-semibold">{formatCurrency(bond.price)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Return Rate</p>
              <p className="text-green-400 font-semibold">{bond.returnRate}% p.a.</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Risk Level</p>
              <p className={`font-semibold ${
                bond.riskLevel === 'Low' ? 'text-green-400' :
                bond.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{bond.riskLevel}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Units</p>
              <p className="text-white font-semibold">{availableUnits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="mb-6">
          <label htmlFor="quantity" className="block text-gray-300 text-sm font-medium mb-2">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isLoading}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-xl text-white font-bold transition-colors"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              min={1}
              max={maxQuantity}
              disabled={isLoading}
            />
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity || isLoading}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-xl text-white font-bold transition-colors"
            >
              +
            </button>
          </div>
          {maxQuantity > 0 && (
            <p className="text-gray-500 text-sm mt-2 text-center">
              Max: {maxQuantity} units
            </p>
          )}
        </div>

        {/* Cost Summary */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 mb-6 border border-yellow-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Cost</span>
            <span className="text-2xl font-bold text-white">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Wallet Balance</span>
            <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
              {formatCurrency(walletBalance)}
            </span>
          </div>
          {!canAfford && (
            <p className="text-red-400 text-sm mt-2">
              Insufficient balance. Need {formatCurrency(totalCost - walletBalance)} more.
            </p>
          )}
        </div>

        {/* Expected Returns */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-1">Expected Annual Return</p>
          <p className="text-green-400 font-semibold text-lg">
            {formatCurrency(totalCost * (bond.returnRate / 100))}
            <span className="text-gray-500 text-sm ml-2">({bond.returnRate}% p.a.)</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            disabled={!canAfford || quantity < 1 || isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>🛒</span>
                Confirm Purchase
              </>
            )}
          </button>
        </div>

        {/* Paper Trading Notice */}
        <p className="text-center text-gray-500 text-xs mt-4">
          🎮 Paper trading mode - using virtual money
        </p>
      </div>
    </div>
  );
}
