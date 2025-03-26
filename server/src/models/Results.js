const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    student: { type: String, required: true },
    score: { type: Number, required: true },
    teacherName: { type: String, required: true },
    className: { type: String, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
