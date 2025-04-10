const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, checkRole } = require('../middleware/auth.middleware');
const HealthRecord = require('../models/healthRecord.model');
const blockchainService = require('../utils/blockchain');
const { generateHash } = require('../utils/encryption');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create new health record
router.post('/', 
  auth, 
  checkRole('doctor'),
  upload.single('file'),
  async (req, res) => {
    try {
      const { recordType, metadata } = req.body;
      const fileData = req.file ? req.file.buffer : null;

      // Create health record
      const healthRecord = new HealthRecord({
        patientId: req.body.patientId,
        doctorId: req.user._id,
        recordType,
        encryptedData: fileData || req.body.data,
        metadata: JSON.parse(metadata)
      });

      // Generate hash for blockchain
      const hash = generateHash(healthRecord);

      // Store hash on blockchain
      const txHash = await blockchainService.storeHealthRecordHash(
        healthRecord._id,
        hash,
        metadata
      );

      healthRecord.blockchainHash = txHash;
      await healthRecord.save();

      res.status(201).json({
        message: 'Health record created successfully',
        recordId: healthRecord._id,
        txHash
      });
    } catch (error) {
      console.error('Create health record error:', error);
      res.status(500).json({ message: 'Server error while creating health record' });
    }
  }
);

// Get health record by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);
    
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Check access permissions
    if (!healthRecord.hasAccess(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify record on blockchain
    const blockchainRecord = await blockchainService.verifyHealthRecord(healthRecord._id);
    if (blockchainRecord.hash !== healthRecord.blockchainHash) {
      return res.status(400).json({ message: 'Record verification failed' });
    }

    // Decrypt data
    const decryptedData = await healthRecord.decryptData();

    res.json({
      record: healthRecord,
      data: decryptedData
    });
  } catch (error) {
    console.error('Get health record error:', error);
    res.status(500).json({ message: 'Server error while fetching health record' });
  }
});

// Grant access to health record
router.post('/:id/access', auth, checkRole('patient'), async (req, res) => {
  try {
    const { userId, expiryTime } = req.body;
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Verify ownership
    if (healthRecord.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to grant access' });
    }

    // Grant access on blockchain
    const txHash = await blockchainService.grantAccess(
      healthRecord._id,
      userId,
      expiryTime
    );

    // Update access list
    healthRecord.accessList.push({
      userId,
      role: req.body.role,
      grantedAt: new Date(),
      expiresAt: expiryTime
    });

    await healthRecord.save();

    res.json({
      message: 'Access granted successfully',
      txHash
    });
  } catch (error) {
    console.error('Grant access error:', error);
    res.status(500).json({ message: 'Server error while granting access' });
  }
});

// Revoke access to health record
router.delete('/:id/access/:userId', auth, checkRole('patient'), async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Verify ownership
    if (healthRecord.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to revoke access' });
    }

    // Revoke access on blockchain
    const txHash = await blockchainService.revokeAccess(
      healthRecord._id,
      req.params.userId
    );

    // Update access list
    healthRecord.accessList = healthRecord.accessList.filter(
      access => access.userId.toString() !== req.params.userId
    );

    await healthRecord.save();

    res.json({
      message: 'Access revoked successfully',
      txHash
    });
  } catch (error) {
    console.error('Revoke access error:', error);
    res.status(500).json({ message: 'Server error while revoking access' });
  }
});

// Get all health records for a patient
router.get('/patient/:patientId', auth, checkRole('patient', 'doctor'), async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({
      patientId: req.params.patientId,
      'accessList.userId': req.user._id
    });

    res.json(healthRecords);
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({ message: 'Server error while fetching patient records' });
  }
});

module.exports = router; 