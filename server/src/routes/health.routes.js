const express = require('express');
const router = express.Router();
const { User, HealthRecord } = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');
const { encryptData, decryptData } = require('../utils/encryption');

// Create a new health record
router.post('/records', auth, async (req, res) => {
    try {
        const { type, title, content, receiverId } = req.body;
        
        // Find receiver
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Encrypt the content using receiver's public key
        const encrypted = await encryptData(content, receiver.encryptionKeys.publicKey);

        // Create new health record
        const record = new HealthRecord({
            type,
            title,
            sender: req.user._id,
            receiver: receiverId,
            encryptedData: {
                jweToken: encrypted.jweToken,
                key: encrypted.key
            }
        });

        // Save record
        await record.save();

        // Add to user's records
        await User.findByIdAndUpdate(req.user._id, {
            $push: { healthRecords: record._id }
        });

        // Add to receiver's shared records
        await User.findByIdAndUpdate(receiverId, {
            $push: { 
                sharedRecords: {
                    record: record._id,
                    sharedWith: req.user._id
                }
            }
        });

        res.status(201).json({
            message: 'Health record created and shared successfully',
            record: record
        });
    } catch (error) {
        console.error('Health record creation error:', error);
        res.status(500).json({ message: 'Failed to create health record' });
    }
});

// Get user's health records
router.get('/records', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'healthRecords',
                populate: {
                    path: 'sender receiver',
                    select: 'username profile.fullName profile.specialization profile.organization'
                }
            })
            .populate({
                path: 'sharedRecords.record',
                populate: {
                    path: 'sender receiver',
                    select: 'username profile.fullName profile.specialization profile.organization'
                }
            });

        res.json({
            ownRecords: user.healthRecords,
            sharedRecords: user.sharedRecords
        });
    } catch (error) {
        console.error('Fetch records error:', error);
        res.status(500).json({ message: 'Failed to fetch health records' });
    }
});

// Get a specific health record
router.get('/records/:id', auth, async (req, res) => {
    try {
        const record = await HealthRecord.findById(req.id)
            .populate('sender receiver', 'username profile');

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check if user has access to this record
        if (record.sender.toString() !== req.user._id.toString() && 
            record.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // If user is receiver, decrypt the content
        if (record.receiver.toString() === req.user._id.toString()) {
            try {
                const decrypted = await decryptData(
                    record.encryptedData.jweToken,
                    req.user.encryptionKeys.privateKey,
                    record.encryptedData.key
                );
                record.content = decrypted;
            } catch (error) {
                console.error('Decryption error:', error);
            }
        }

        res.json(record);
    } catch (error) {
        console.error('Fetch record error:', error);
        res.status(500).json({ message: 'Failed to fetch record' });
    }
});

// Update record status
router.patch('/records/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const record = await HealthRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (record.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        record.status = status;
        await record.save();

        res.json({ message: 'Record status updated', record });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Failed to update record status' });
    }
});

module.exports = router; 