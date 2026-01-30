const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// GET /api/portfolio - Get user's portfolio with holdings
router.get('/', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.userId })
      .populate({
        path: 'holdings.bond',
        select: 'name issuer price returnRate riskLevel sector maturityYears isActive'
      });

    if (!portfolio) {
      return res.json({
        success: true,
        data: {
          portfolio: {
            holdings: [],
            totalInvested: 0,
            totalBondsOwned: 0,
            currentValue: 0,
            totalReturns: 0,
            percentageReturn: 0
          }
        }
      });
    }

    // Calculate current values for each holding
    const holdingsWithValues = portfolio.holdings.map(holding => {
      const bond = holding.bond;
      const currentValue = bond ? bond.price * holding.quantity : 0;
      const profitLoss = currentValue - holding.totalInvested;
      const percentageReturn = holding.totalInvested > 0 
        ? ((profitLoss / holding.totalInvested) * 100).toFixed(2)
        : 0;

      return {
        id: holding._id,
        bond: bond ? {
          id: bond._id,
          name: bond.name,
          issuer: bond.issuer,
          currentPrice: bond.price,
          returnRate: bond.returnRate,
          riskLevel: bond.riskLevel,
          sector: bond.sector,
          maturityYears: bond.maturityYears,
          isActive: bond.isActive
        } : null,
        quantity: holding.quantity,
        averageBuyPrice: holding.averageBuyPrice,
        totalInvested: holding.totalInvested,
        currentValue: currentValue,
        profitLoss: profitLoss,
        percentageReturn: parseFloat(percentageReturn),
        firstPurchaseDate: holding.firstPurchaseDate,
        lastTransactionDate: holding.lastTransactionDate
      };
    }).filter(h => h.bond && h.quantity > 0);

    // Calculate portfolio totals
    const totalInvested = holdingsWithValues.reduce((sum, h) => sum + h.totalInvested, 0);
    const currentValue = holdingsWithValues.reduce((sum, h) => sum + h.currentValue, 0);
    const totalReturns = currentValue - totalInvested;
    const percentageReturn = totalInvested > 0 
      ? ((totalReturns / totalInvested) * 100).toFixed(2)
      : 0;

    // Calculate expected annual returns based on bond return rates
    const expectedAnnualReturns = holdingsWithValues.reduce((sum, h) => {
      if (h.bond) {
        return sum + (h.currentValue * (h.bond.returnRate / 100));
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        portfolio: {
          holdings: holdingsWithValues,
          totalInvested: totalInvested,
          totalBondsOwned: holdingsWithValues.length,
          currentValue: currentValue,
          totalReturns: totalReturns,
          percentageReturn: parseFloat(percentageReturn),
          expectedAnnualReturns: expectedAnnualReturns,
          updatedAt: portfolio.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio',
      error: error.message
    });
  }
});

// GET /api/portfolio/summary - Quick portfolio summary
router.get('/summary', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.userId })
      .populate({
        path: 'holdings.bond',
        select: 'price returnRate'
      });

    if (!portfolio) {
      return res.json({
        success: true,
        data: {
          totalInvested: 0,
          currentValue: 0,
          totalBondsOwned: 0,
          expectedAnnualReturns: 0
        }
      });
    }

    const activeHoldings = portfolio.holdings.filter(h => h.bond && h.quantity > 0);
    const totalInvested = activeHoldings.reduce((sum, h) => sum + h.totalInvested, 0);
    const currentValue = activeHoldings.reduce((sum, h) => sum + (h.bond.price * h.quantity), 0);
    const expectedAnnualReturns = activeHoldings.reduce((sum, h) => {
      return sum + (h.bond.price * h.quantity * (h.bond.returnRate / 100));
    }, 0);

    res.json({
      success: true,
      data: {
        totalInvested,
        currentValue,
        totalBondsOwned: activeHoldings.length,
        expectedAnnualReturns,
        totalReturns: currentValue - totalInvested,
        percentageReturn: totalInvested > 0 
          ? parseFloat(((currentValue - totalInvested) / totalInvested * 100).toFixed(2))
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio summary',
      error: error.message
    });
  }
});

// GET /api/portfolio/transactions - Get recent transactions
router.get('/transactions', protect, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const transactions = await Transaction.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('bond', 'name issuer');

    res.json({
      success: true,
      data: { transactions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

module.exports = router;
