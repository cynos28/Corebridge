const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    student: { type: String, required: true },
    score: { type: String, required: true },
    class: { type: String, required: true },
    teacher: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", ResultSchema);
