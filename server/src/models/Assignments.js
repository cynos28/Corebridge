const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    className: { type: String, required: true },
    teacherName: { type: String, required: true },
    dueDate: { type: Date, required: true },
    document: { type: String }, // e.g., storing filename or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignments", assignmentSchema);
