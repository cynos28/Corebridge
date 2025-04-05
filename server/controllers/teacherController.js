const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
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
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    // Check if username or email already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const teacher = new Teacher({
      ...req.body,
      password: hashedPassword,
      birthday: new Date(req.body.birthday)
    });

    const savedTeacher = await teacher.save();
    const teacherResponse = savedTeacher.toObject();
    delete teacherResponse.password;
    
    res.status(201).json(teacherResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating teacher', error: error.message });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Convert birthday string to Date if provided
    if (updateData.birthday) {
      updateData.birthday = new Date(updateData.birthday);
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error updating teacher', error: error.message });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
};