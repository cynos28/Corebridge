const Teacher = require("../models/Teacher");
const path = require('path');
const fs = require('fs');

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single teacher
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const teacherData = req.body;
    
    if (req.file) {
      // Update image URL to include /public prefix
      teacherData.photoUrl = `/public/uploads/teachers/${req.file.filename}`;
    }

    const teacher = new Teacher(teacherData);
    await teacher.save();
    
    res.status(201).json(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) {
      // Update image URL to include /public prefix
      updateData.photoUrl = `/public/uploads/teachers/${req.file.filename}`;
      
      // Delete old image if exists
      const oldTeacher = await Teacher.findById(req.params.id);
      if (oldTeacher?.photoUrl) {
        const oldImagePath = path.join(__dirname, '../../public', oldTeacher.photoUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
