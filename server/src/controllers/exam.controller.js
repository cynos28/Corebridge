const Exam = require("../models/Exam");

class ExamController {
  // Create a new exam
  async createExam(req, res) {
    try {
      const exam = new Exam(req.body);
      await exam.save();
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all exams
  async getExams(req, res) {
    try {
      const exams = await Exam.find();
      res.status(200).json(exams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a single exam by ID
  async getExamById(req, res) {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.status(200).json(exam);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update an exam by ID
  async updateExam(req, res) {
    try {
      const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.status(200).json(exam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete an exam by ID
  async deleteExam(req, res) {
    try {
      const exam = await Exam.findByIdAndDelete(req.params.id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ExamController();
