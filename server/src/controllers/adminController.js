const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
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
    const updates = req.body;
    if (req.file) {
      updates.photoUrl = `/uploads/${req.file.filename}`;
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    });
    
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAddedTeachers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    const teachers = await Teacher.find({ _id: { $in: admin.addedTeachers } })
      .select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
