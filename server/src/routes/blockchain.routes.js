const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth.middleware');
const blockchainService = require('../utils/blockchain');
const HealthRecord = require('../models/healthRecord.model');

// Verify health record on blockchain
router.get('/verify/:recordId', auth, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.recordId);
    
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Check access permissions
    if (!healthRecord.hasAccess(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const blockchainRecord = await blockchainService.verifyHealthRecord(healthRecord._id);
    const isValid = blockchainRecord.hash === healthRecord.blockchainHash;

    res.json({
      isValid,
      blockchainRecord,
      localRecord: healthRecord
    });
  } catch (error) {
    console.error('Blockchain verification error:', error);
    res.status(500).json({ message: 'Server error during blockchain verification' });
  }
});

// Check access permissions on blockchain
router.get('/access/:recordId/:userId', auth, async (req, res) => {
  try {
    const hasAccess = await blockchainService.checkAccess(
      req.params.recordId,
      req.params.userId
    );

    res.json({ hasAccess });
  } catch (error) {
    console.error('Access check error:', error);
    res.status(500).json({ message: 'Server error while checking access' });
  }
});

// Get transaction history for a health record
router.get('/transactions/:recordId', auth, checkRole('patient', 'doctor'), async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.recordId);
    
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Check access permissions
    if (!healthRecord.hasAccess(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get transaction history from blockchain
    const transactions = await blockchainService.getTransactionHistory(healthRecord._id);

    res.json(transactions);
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ message: 'Server error while fetching transaction history' });
  }
});

// Get blockchain network status
router.get('/status', auth, async (req, res) => {
  try {
    const networkStatus = await blockchainService.getNetworkStatus();
    res.json(networkStatus);
  } catch (error) {
    console.error('Network status error:', error);
    res.status(500).json({ message: 'Server error while fetching network status' });
  }
});

// Get user's blockchain wallet balance
router.get('/balance/:walletAddress', auth, async (req, res) => {
  try {
    const balance = await blockchainService.getWalletBalance(req.params.walletAddress);
    res.json({ balance });
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({ message: 'Server error while checking wallet balance' });
  }
});

module.exports = router; 