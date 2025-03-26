const Result = require("../models/Result");

// CREATE a new result
exports.createResult = async (req, res) => {
  try {
    const { subjectName, student, score, teacherName, className, dueDate } = req.body;
    const result = new Result({ subjectName, student, score, teacherName, className, dueDate });
    const savedResult = await result.save();
    res.status(201).json(savedResult);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET all results
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving results:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET one result by ID
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving result:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a result by ID
exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    result.subjectName = req.body.subjectName || result.subjectName;
    result.student = req.body.student || result.student;
    result.score = req.body.score || result.score;
    result.teacherName = req.body.teacherName || result.teacherName;
    result.className = req.body.className || result.className;
    result.dueDate = req.body.dueDate || result.dueDate;
    const updatedResult = await result.save();
    res.status(200).json(updatedResult);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE a result by ID
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: error.message });
  }
};
