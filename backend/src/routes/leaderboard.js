const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// GET /api/leaderboard - Get top traders ranked by returns
router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Get all portfolios with user data
    const portfolios = await Portfolio.find()
      .populate({
        path: 'user',
        select: 'name email createdAt'
      })
      .populate({
        path: 'holdings.bond',
        select: 'name price'
      })
      .lean();

    // Calculate returns and filter out empty portfolios
    const leaderboardData = portfolios
      .map(portfolio => {
        // Calculate current value
        const currentValue = portfolio.holdings.reduce((sum, holding) => {
          if (holding.bond && holding.quantity > 0) {
            return sum + (holding.bond.price * holding.quantity);
          }
          return sum;
        }, 0);

        // Calculate total invested
        const totalInvested = portfolio.holdings.reduce((sum, holding) => {
          if (holding.quantity > 0) {
            return sum + holding.totalInvested;
          }
          return sum;
        }, 0);

        // Calculate returns
        const totalReturns = currentValue - totalInvested;
        const percentageReturn = totalInvested > 0 
          ? ((totalReturns / totalInvested) * 100)
          : 0;

        return {
          userId: portfolio.user._id,
          userName: portfolio.user.name,
          totalInvested,
          currentValue,
          totalReturns,
          percentageReturn: parseFloat(percentageReturn.toFixed(2)),
          bondsOwned: portfolio.holdings.filter(h => h.quantity > 0).length,
          memberSince: portfolio.user.createdAt
        };
      })
      .filter(entry => entry.totalInvested > 0) // Only include users who have invested
      .sort((a, b) => b.percentageReturn - a.percentageReturn); // Sort by percentage return

    // Add rank
    const rankedData = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    // Paginate
    const paginatedData = rankedData.slice(skip, skip + limitNum);
    const totalCount = rankedData.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        leaderboard: paginatedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        stats: {
          totalTraders: rankedData.length,
          avgReturn: rankedData.length > 0
            ? parseFloat((rankedData.reduce((sum, e) => sum + e.percentageReturn, 0) / rankedData.length).toFixed(2))
            : 0,
          topReturn: rankedData.length > 0 ? rankedData[0].percentageReturn : 0
        }
      }
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

module.exports = router;
