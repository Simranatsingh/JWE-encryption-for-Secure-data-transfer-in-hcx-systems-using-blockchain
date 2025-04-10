const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['diagnosis', 'prescription', 'lab_result', 'imaging', 'vaccination', 'other'],
    required: true
  },
  encryptedData: {
    type: String,
    required: true
  },
  metadata: {
    title: String,
    description: String,
    date: Date,
    tags: [String]
  },
  blockchainHash: {
    type: String,
    required: true
  },
  accessList: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    grantedAt: Date,
    expiresAt: Date
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Encrypt data before saving
healthRecordSchema.pre('save', async function(next) {
  if (!this.isModified('encryptedData')) return next();
  
  try {
    this.encryptedData = await encrypt(this.encryptedData);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to decrypt data
healthRecordSchema.methods.decryptData = async function() {
  return decrypt(this.encryptedData);
};

// Method to check access
healthRecordSchema.methods.hasAccess = function(userId) {
  const access = this.accessList.find(a => 
    a.userId.toString() === userId.toString() && 
    (!a.expiresAt || a.expiresAt > new Date())
  );
  return !!access;
};

const HealthRecord = mongoose.models.HealthRecord || mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord; 