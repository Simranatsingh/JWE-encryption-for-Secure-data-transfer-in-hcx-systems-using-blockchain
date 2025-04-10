const mongoose = require('mongoose');
const { generateHash } = require('../utils/encryption');

// Schema for secure medical reports
const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  reportType: {
    type: String,
    enum: ['medical_report', 'test_result', 'prescription', 'insurance_claim', 'diagnosis', 'treatment_plan', 'medical_history'],
    required: true
  },
  // Who created the report
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Who the report is for
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The encrypted content using JWE
  encryptedContent: {
    type: String,
    required: true
  },
  // Metadata for easier searching without decrypting
  metadata: {
    date: {
      type: Date,
      default: Date.now
    },
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    size: Number,
    contentType: String
  },
  // Hash of the content for integrity verification
  contentHash: {
    type: String
  },
  // Track who has access
  accessControl: {
    isPublic: {
      type: Boolean,
      default: false
    },
    authorizedUsers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      accessLevel: {
        type: String,
        enum: ['read', 'write', 'admin'],
        default: 'read'
      },
      grantedAt: {
        type: Date,
        default: Date.now
      },
      expiresAt: Date
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected', 'archived'],
    default: 'submitted'
  },
  views: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // When report was created/updated
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate content hash before saving
reportSchema.pre('save', async function(next) {
  if (this.isModified('encryptedContent')) {
    // Generate hash for the encrypted content
    this.contentHash = generateHash(this.encryptedContent);
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

// Method to check if a user has access to this report
reportSchema.methods.hasAccess = function(userId) {
  // Creator and recipient always have access
  if (this.senderId.toString() === userId.toString() || 
      this.recipientId.toString() === userId.toString()) {
    return true;
  }
  
  // Check authorized users
  if (this.accessControl.isPublic) {
    return true;
  }
  
  const authorizedUser = this.accessControl.authorizedUsers.find(user => 
    user.userId.toString() === userId.toString() && 
    (!user.expiresAt || user.expiresAt > new Date())
  );
  
  return !!authorizedUser;
};

// Method to track when a user views the report
reportSchema.methods.trackView = async function(userId) {
  this.views.push({
    userId,
    viewedAt: new Date()
  });
  
  return this.save();
};

// Method to grant access to another user
reportSchema.methods.grantAccess = function(userId, accessLevel = 'read', expiresAt = null) {
  // Remove any existing entry for this user
  this.accessControl.authorizedUsers = this.accessControl.authorizedUsers.filter(
    user => user.userId.toString() !== userId.toString()
  );
  
  // Add new access entry
  this.accessControl.authorizedUsers.push({
    userId,
    accessLevel,
    grantedAt: new Date(),
    expiresAt
  });
};

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

module.exports = Report; 