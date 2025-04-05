const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    bloodType: { type: String, required: true },
    birthday: { type: Date, required: true },
    sex: { type: String, enum: ["male", "female"], required: true },
    subjects: [{ type: String }],
    photoUrl: { type: String },
    teacherId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Add pre-save middleware to handle data cleanup and generate teacherId
teacherSchema.pre('save', async function(next) {
  try {
    // Handle subjects cleanup
    if (this.subjects) {
      this.subjects = this.subjects.filter(subject => subject.trim().length > 0);
    }

    // Generate teacherId for new teachers only if not set
    if (!this.teacherId) {
      const currentYear = new Date().getFullYear().toString().substr(-2);
      const count = await this.constructor.countDocuments();
      const sequence = String(count + 1).padStart(3, '0');
      this.teacherId = `IT${currentYear}${sequence}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
