const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import Bond model (will use JSON fallback if DB not connected)
let Bond;
try {
  Bond = require('../models/Bond');
} catch (e) {
  Bond = null;
}

// Fallback to JSON data if MongoDB is not available
const bondsJSON = require('../data/bonds.json');

// Helper to check if MongoDB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/bonds - Get all bonds
router.get('/', async (req, res) => {
  try {
    let bonds;

    if (isDbConnected() && Bond) {
      // Use MongoDB
      const query = {};
      const { risk, sector, search, minReturn, maxReturn } = req.query;

      // Filter by risk level
      if (risk) {
        query.riskLevel = { $regex: new RegExp(`^${risk}$`, 'i') };
      }

      // Filter by sector
      if (sector) {
        query.sector = { $regex: new RegExp(sector, 'i') };
      }

      // Search by name or issuer
      if (search) {
        query.$or = [
          { name: { $regex: new RegExp(search, 'i') } },
          { issuer: { $regex: new RegExp(search, 'i') } }
        ];
      }

      // Filter by return rate range
      if (minReturn || maxReturn) {
        query.returnRate = {};
        if (minReturn) query.returnRate.$gte = parseFloat(minReturn);
        if (maxReturn) query.returnRate.$lte = parseFloat(maxReturn);
      }

      bonds = await Bond.find(query).sort({ returnRate: -1 });
    } else {
      // Fallback to JSON
      bonds = [...bondsJSON];
      const { risk, sector, search, minReturn, maxReturn } = req.query;

      if (risk) {
        bonds = bonds.filter(b => b.riskLevel.toLowerCase() === risk.toLowerCase());
      }
      if (sector) {
        bonds = bonds.filter(b => b.sector.toLowerCase().includes(sector.toLowerCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        bonds = bonds.filter(b =>
          b.name.toLowerCase().includes(s) || b.issuer.toLowerCase().includes(s)
        );
      }
      if (minReturn) {
        bonds = bonds.filter(b => b.returnRate >= parseFloat(minReturn));
      }
      if (maxReturn) {
        bonds = bonds.filter(b => b.returnRate <= parseFloat(maxReturn));
      }
    }

    res.json({
      success: true,
      count: bonds.length,
      source: isDbConnected() ? 'mongodb' : 'json',
      data: bonds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bonds',
      error: error.message
    });
  }
});

// GET /api/bonds/:id - Get single bond by ID
router.get('/:id', async (req, res) => {
  try {
    let bond;

    if (isDbConnected() && Bond) {
      // Check if ID is valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bond = await Bond.findById(req.params.id);
      }
      // Also try finding by numeric string ID for compatibility
      if (!bond) {
        bond = await Bond.findOne({ id: req.params.id });
      }
    } else {
      // Fallback to JSON
      bond = bondsJSON.find(b => b.id === req.params.id);
    }

    if (!bond) {
      return res.status(404).json({
        success: false,
        message: 'Bond not found'
      });
    }

    res.json({
      success: true,
      source: isDbConnected() ? 'mongodb' : 'json',
      data: bond
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bond',
      error: error.message
    });
  }
});

module.exports = router;
