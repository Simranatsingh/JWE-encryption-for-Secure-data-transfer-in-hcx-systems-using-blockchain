const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const healthRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['prescription', 'diagnosis', 'claim', 'test_result'],
    required: true
  },
  title: String,
  content: String,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  encryptedData: {
    jweToken: String,
    key: String
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'healthcare_provider', 'insurance_provider'],
    required: true
  },
  profile: {
    fullName: String,
    specialization: String,  // For doctors
    organization: String,    // For healthcare/insurance providers
    contact: String,
    address: String
  },
  walletAddress: {
    type: String,
    unique: false,  // Remove unique constraint completely
    sparse: false,  // Don't use sparse indexing
    default: null
  },
  publicKey: String,
  encryptionKeys: {
    publicKey: String,
    privateKey: String
  },
  healthRecords: [healthRecordSchema],
  sharedRecords: [{
    record: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthRecord'
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Before saving, ensure walletAddress is properly handled
userSchema.pre('save', async function(next) {
  // Handle password hashing if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('Password hashed successfully for user:', this.username || this.email);
    } catch (error) {
      console.error('Error hashing password:', error);
      return next(error);
    }
  }
  
  // Set walletAddress to null or a unique string value
  if (!this.walletAddress || this.walletAddress === '') {
    // Generate a random id to ensure uniqueness instead of null
    this.walletAddress = 'no-wallet-' + this._id.toString();
  }
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  try {
    const userObject = this.toObject();
    delete userObject.password;
    
    // Safely remove privateKey if it exists in encryptionKeys
    if (userObject.encryptionKeys && userObject.encryptionKeys.privateKey) {
      delete userObject.encryptionKeys.privateKey;
    }
    
    return userObject;
  } catch (error) {
    console.error('Error in getPublicProfile:', error);
    // Return a safe minimal profile
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role
    };
  }
};

const User = mongoose.model('User', userSchema);
// Check if the HealthRecord model already exists to prevent duplicate model error
const HealthRecord = mongoose.models.HealthRecord || mongoose.model('HealthRecord', healthRecordSchema);

module.exports = { User, HealthRecord }; 