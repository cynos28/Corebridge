const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Create Student
router.post('/', auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if student exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Create user account
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: 'student',
      name: `${req.body.firstName} ${req.body.lastName}`
    });
    await user.save();

    // Create student with user reference
    const student = new Student({
      ...req.body,
      password: hashedPassword,
      userId: user._id
    });
    await student.save();

    // Update user with student reference
    user.studentId = student._id;
    await user.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Student
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update associated user if password changed
    if (updates.password) {
      await User.findOneAndUpdate(
        { studentId: student._id },
        { password: updates.password }
      );
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete associated user
    await User.findOneAndDelete({ studentId: student._id });
    await student.remove();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
