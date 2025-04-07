const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  description: String,
  photoUrl: String,
  addedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
