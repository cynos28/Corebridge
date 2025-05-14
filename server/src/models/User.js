const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Add index for email field
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true,
    index: true // Add index for role field
  },
  photoUrl: {
    type: String,
    default: '/avatar.png'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Add compound index for login queries
userSchema.index({ email: 1, role: 1 });

module.exports = mongoose.model('User', userSchema);
