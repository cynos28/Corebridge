const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching teachers', 
      error: error.message 
    });
  }
};

// Get single teacher
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching teacher', 
      error: error.message 
    });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    // Check existing teacher
    const existingTeacher = await Teacher.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (existingTeacher) {
      if (req.file) await fs.unlink(req.file.path).catch(console.error);
      return res.status(400).json({
        message: existingTeacher.username === req.body.username 
          ? 'Username already exists' 
          : 'Email already exists'
      });
    }

    // Create User first
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      role: 'teacher',
      name: `${req.body.firstName} ${req.body.lastName}`,
      photoUrl: req.file ? `/uploads/teachers/${req.file.filename}` : undefined
    });
    await user.save();

    // Create teacher with user reference
    const teacherData = {
      ...req.body,
      password: hashedPassword,
      userId: user._id,
      photoUrl: user.photoUrl,
      subjects: req.body['subjects[]'] ? 
        (Array.isArray(req.body['subjects[]']) ? req.body['subjects[]'] : [req.body['subjects[]']]) : []
    };
    delete teacherData['subjects[]'];

    const teacher = await Teacher.create(teacherData);
    
    const response = teacher.toObject();
    delete response.password;
    
    res.status(201).json(response);
  } catch (error) {
    // If file was uploaded, delete it since save failed
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists`
      });
    }

    console.error('Error creating teacher:', error);
    res.status(400).json({ 
      message: 'Error creating teacher', 
      error: error.message || 'Unknown error occurred'
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle file upload
    if (req.file) {
      updateData.photoUrl = `/uploads/teachers/${req.file.filename}`;

      // Get old teacher data to delete previous photo
      const oldTeacher = await Teacher.findById(req.params.id);
      if (oldTeacher?.photoUrl) {
        const oldPhotoPath = path.join(__dirname, '../../public', oldTeacher.photoUrl);
        await fs.unlink(oldPhotoPath).catch(console.error);
      }
    }

    // Handle subjects array
    if (req.body['subjects[]']) {
      updateData.subjects = Array.isArray(req.body['subjects[]'])
        ? req.body['subjects[]']
        : [req.body['subjects[]']];
      delete updateData['subjects[]'];
    }

    // Convert birthday string to Date if provided
    if (updateData.birthday) {
      updateData.birthday = new Date(updateData.birthday);
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query' 
      }
    ).select('-password');

    if (!teacher) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    // Delete uploaded file if update failed
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }

    console.error('Error updating teacher:', error);
    res.status(400).json({ 
      message: 'Error updating teacher', 
      error: error.message 
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete associated photo if it exists
    if (teacher.photoUrl) {
      const photoPath = path.join(__dirname, '../../public', teacher.photoUrl);
      await fs.unlink(photoPath).catch(console.error);
    }

    await teacher.deleteOne();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ 
      message: 'Error deleting teacher', 
      error: error.message 
    });
  }
};