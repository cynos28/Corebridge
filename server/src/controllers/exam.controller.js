// controllers/examController.js

const Exam = require('../models/Exam'); // adjust the path as needed

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { subject, class: examClass, teacher, date } = req.body;
    const exam = new Exam({ subject, class: examClass, teacher, date });
    const savedExam = await exam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an exam by ID
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    // Update fields if provided in the request body
    exam.subject = req.body.subject || exam.subject;
    exam.class = req.body.class || exam.class;
    exam.teacher = req.body.teacher || exam.teacher;
    exam.date = req.body.date || exam.date;

    const updatedExam = await exam.save();
    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    await exam.remove();
    res.status(200).json({ message: 'Exam removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
