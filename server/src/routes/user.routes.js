const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.get('/health-records', auth, userController.getHealthRecords);
router.post('/health-records', auth, userController.createHealthRecord);
router.put('/health-records/:id', auth, userController.updateHealthRecord);
router.delete('/health-records/:id', auth, userController.deleteHealthRecord);

module.exports = router; 