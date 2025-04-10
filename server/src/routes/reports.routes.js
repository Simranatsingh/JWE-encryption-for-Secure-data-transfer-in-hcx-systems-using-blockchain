const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth.middleware');
const reportsService = require('../services/reports.service');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new report - accessible to all provider roles
router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('reportType').isIn([
      'medical_report', 'test_result', 'prescription', 
      'insurance_claim', 'diagnosis', 'treatment_plan', 'medical_history'
    ]).withMessage('Valid report type is required'),
    body('content').optional(),
    body('recipientId').notEmpty().withMessage('Recipient ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      console.log('Creating report with data:', {
        title: req.body.title,
        reportType: req.body.reportType,
        recipientId: req.body.recipientId,
        senderId: req.user._id,
        userRole: req.user.role
      });
      
      // Get data with defaults
      const data = {
        title: req.body.title,
        description: req.body.description || '',
        reportType: req.body.reportType,
        content: req.body.content || 'No content provided', // Default content
        recipientId: req.body.recipientId,
        metadata: req.body.metadata || {}
      };
      
      // Ensure user has permission - any role can create reports
      const validRoles = ['patient', 'doctor', 'healthcare_provider', 'insurance_provider'];
      if (!validRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to create reports' });
      }
      
      const report = await reportsService.createReport(
        {
          title: data.title,
          description: data.description,
          reportType: data.reportType,
          content: data.content,
          ...data.metadata
        },
        req.user._id,
        data.recipientId
      );
      
      console.log('Report created successfully:', {
        reportId: report._id,
        title: report.title,
        reportType: report.reportType
      });
      
      res.status(201).json({
        message: 'Report created successfully',
        report: {
          _id: report._id,
          title: report.title,
          reportType: report.reportType,
          status: report.status,
          createdAt: report.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating report:', error);
      
      // More specific error messages based on the error
      if (error.message.includes('Recipient not found')) {
        return res.status(404).json({ message: 'Recipient not found' });
      }
      
      res.status(500).json({ 
        message: 'Failed to create report',
        error: error.message 
      });
    }
  }
);

// Get a report by ID
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching report by ID:', req.params.id);
    const report = await reportsService.getReport(req.params.id, req.user._id);
    console.log('Report found:', { 
      reportId: report._id, 
      title: report.title,
      hasDecryptedContent: !!report.decryptedContent
    });
    res.json(report);
  } catch (error) {
    console.error('Error retrieving report:', error);
    
    if (error.message === 'Report not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'You do not have access to this report') {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Failed to retrieve report',
      error: error.message 
    });
  }
});

// Get all reports for a user (both sent and received)
router.get('/', auth, async (req, res) => {
  try {
    console.log('Listing reports for user:', req.user._id);
    const filters = {
      reportType: req.query.reportType,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const reports = await reportsService.listReports(req.user._id, filters);
    console.log('Reports found:', { 
      sentCount: reports.sent.length, 
      receivedCount: reports.received.length 
    });
    res.json(reports);
  } catch (error) {
    console.error('Error listing reports:', error);
    res.status(500).json({ 
      message: 'Failed to list reports',
      error: error.message 
    });
  }
});

// Share a report with another user
router.post(
  '/:id/share',
  auth,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('accessLevel').optional().isIn(['read', 'write', 'admin']).withMessage('Valid access level is required'),
    body('expiresAt').optional().isISO8601().withMessage('Valid expiration date is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      console.log('Sharing report:', {
        reportId: req.params.id,
        userId: req.body.userId,
        accessLevel: req.body.accessLevel
      });
      
      const { userId, accessLevel, expiresAt } = req.body;
      
      const report = await reportsService.shareReport(
        req.params.id,
        req.user._id,
        userId,
        accessLevel,
        expiresAt ? new Date(expiresAt) : null
      );
      
      console.log('Report shared successfully');
      res.json({
        message: 'Report shared successfully',
        report: {
          _id: report._id,
          title: report.title,
          sharedWith: userId
        }
      });
    } catch (error) {
      console.error('Error sharing report:', error);
      
      if (error.message === 'Report not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'You do not have permission to share this report') {
        return res.status(403).json({ message: error.message });
      }
      
      res.status(500).json({ 
        message: 'Failed to share report',
        error: error.message 
      });
    }
  }
);

// Update report status
router.patch(
  '/:id/status',
  auth,
  [
    body('status').isIn(['draft', 'submitted', 'approved', 'rejected', 'archived'])
      .withMessage('Valid status is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      console.log('Updating report status:', {
        reportId: req.params.id,
        status: req.body.status
      });
      
      const report = await reportsService.updateReportStatus(
        req.params.id,
        req.user._id,
        req.body.status
      );
      
      console.log('Report status updated successfully');
      res.json({
        message: 'Report status updated successfully',
        report: {
          _id: report._id,
          title: report.title,
          status: report.status,
          updatedAt: report.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      
      if (error.message === 'Report not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'You do not have permission to update this report') {
        return res.status(403).json({ message: error.message });
      }
      
      res.status(500).json({ 
        message: 'Failed to update report status',
        error: error.message 
      });
    }
  }
);

module.exports = router; 