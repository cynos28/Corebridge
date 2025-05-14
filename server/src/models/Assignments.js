const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    className: { type: String, required: true },
    teacherName: { type: String, required: true },
    dueDate: { type: Date, required: true },
    document: { type: String }, // Filename or path
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        filePath: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
        grade: { type: Number },
        feedback: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
