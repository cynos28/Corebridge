const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const Admin = require('../src/models/Admin');
const User = require('../src/models/User');
const Teacher = require('../src/models/Teacher');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define route handlers inline since controller import is failing
router.get('/profile', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', auth, upload.single('photo'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.photoUrl = `/uploads/${req.file.filename}`;
    }
    const admin = await Admin.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/new', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    
    // Check if admin/user already exists
    const existingAdmin = await Admin.findOne({ email });
    const existingUser = await User.findOne({ email });
    
    if (existingAdmin || existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user first
    const user = new User({
      email,
      password: hashedPassword,
      role: 'admin'
    });
    await user.save();

    // Create admin with user reference
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      description,
      userId: user._id,
      role: 'admin',
      photoUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    await admin.save();
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    res.status(201).json(adminResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/teachers', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
