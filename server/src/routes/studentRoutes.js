const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create student
router.post('/', auth, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const student = new Student({
      ...req.body,
      password: hashedPassword
    });
    const newStudent = await student.save();
    const studentResponse = newStudent.toObject();
    delete studentResponse.password;
    res.status(201).json(studentResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'grade', 'class', 'sex'];
    for (const field of requiredFields) {
      if (!updates[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add cache control header
    res.set('Cache-Control', 'no-store');
    res.json(student);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      message: error.message,
      error: error
    });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
