const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Update multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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
      updates.photoUrl = `/public/uploads/teachers/${req.file.filename}`;  // Updated path
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
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    const existingUser = await User.findOne({ email });
    
    if (existingAdmin || existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    
    // Create user first
    const user = new User({
      email,
      password: hashedPassword,
      role: 'admin',
      name // Add name to user
    });
    
    await user.save();

    // Create admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      description: description || '',
      userId: user._id,
      role: 'admin',
      photoUrl: req.file ? `/public/uploads/teachers/${req.file.filename}` : ''  // Updated path
    });

    await admin.save();

    // Update user with adminId reference
    user.adminId = admin._id;
    await user.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminResponse
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Error creating admin account',
      error: error.stack
    });
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
