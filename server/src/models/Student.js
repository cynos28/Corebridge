const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    grade: { type: Number, required: true },
    class: { type: String, required: true },
    sex: { type: String, enum: ["male", "female"], required: true },
    studentId: { type: String, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Generate studentId before saving
studentSchema.pre('save', async function(next) {
  try {
    if (!this.studentId) {
      const currentYear = new Date().getFullYear().toString().substr(-2);
      const count = await this.constructor.countDocuments();
      const sequence = String(count + 1).padStart(3, '0');
      this.studentId = `ST${currentYear}${sequence}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Student", studentSchema);
