const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const Admin = require('../src/models/Admin');
const Teacher = require('../src/models/Teacher');

// Get admin profile
router.get('/profile', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all teachers added by admin
router.get('/teachers', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
