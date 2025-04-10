const express = require('express');
const router = express.Router();
const multer = require('multer');
const { encryptData, decryptData } = require('../utils/encryption');
const { User } = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

// Set up multer for file uploads
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|json|txt)$/)) {
            return cb(new Error('Please upload a PDF, JSON, or TXT file'));
        }
        cb(null, true);
    }
});

// Upload and encrypt document
router.post('/upload', auth, upload.single('document'), async (req, res) => {
    try {
        const { receiverId } = req.body;
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Encrypt the document
        const encryptedDocument = await encryptData(req.file.buffer, receiver.encryptionKeys.publicKey);

        // Store or send the encrypted document
        // For demonstration, we'll just return it
        res.status(201).json({
            message: 'Document uploaded and encrypted successfully',
            encryptedDocument
        });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ message: 'Failed to upload and encrypt document' });
    }
});

// Decrypt and view document
router.get('/view/:id', auth, async (req, res) => {
    try {
        const { documentId } = req.params;
        // Fetch the encrypted document from storage
        // For demonstration, we'll assume it's fetched
        const encryptedDocument = '...'; // Replace with actual fetch logic

        // Decrypt the document
        const decryptedDocument = await decryptData(encryptedDocument, req.user.encryptionKeys.privateKey);

        res.status(200).send(decryptedDocument);
    } catch (error) {
        console.error('Document view error:', error);
        res.status(500).json({ message: 'Failed to decrypt and view document' });
    }
});

module.exports = router; 