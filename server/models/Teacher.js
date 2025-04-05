const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bloodType: { type: String, required: true },
  birthday: { type: Date, required: true },
  sex: { type: String, enum: ['male', 'female'], required: true },
  subjects: [{ type: String }],
  photoUrl: { type: String },
  teacherId: { type: String, unique: true },
}, { timestamps: true });

// Generate unique teacherId before saving
teacherSchema.pre('save', async function(next) {
  if (!this.teacherId) {
    const currentYear = new Date().getFullYear().toString().substr(-2);
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.teacherId = `T${currentYear}${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);