const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const path = require('path');

exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    if (req.file) {
      updates.photoUrl = `/uploads/${req.file.filename}`;
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      description,
      role: 'admin',
      photoUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    const savedAdmin = await admin.save();
    
    // Remove password from response
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;
    
    res.status(201).json(adminResponse);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ 
      message: 'Error creating admin', 
      error: error.message 
    });
  }
};

exports.getAddedTeachers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    const teachers = await Teacher.find()
      .select('-password')
      .sort({ createdAt: -1 });
      
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
