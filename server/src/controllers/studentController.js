const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { password, ...studentData } = req.body;
    
    // Check if student exists
    const existingStudent = await Student.findOne({
      $or: [{ email: studentData.email }, { username: studentData.username }]
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'Student with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create student
    const student = new Student({
      ...studentData,
      password: hashedPassword
    });

    const savedStudent = await student.save();
    const studentResponse = savedStudent.toObject();
    delete studentResponse.password;
    
    res.status(201).json(studentResponse);
  } catch (error) {
    res.status(400).json({
      message: 'Error creating student',
      error: error.message
    });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving students',
      error: error.message
    });
  }
};

// Get single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving student',
      error: error.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Remove password from updates
    delete updates._id; // Remove _id if present
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ 
      message: error.message || 'Error updating student',
      error: error 
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting student',
      error: error.message
    });
  }
};
