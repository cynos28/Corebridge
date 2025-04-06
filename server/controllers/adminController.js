const Admin = require('../src/models/Admin');
const bcrypt = require('bcryptjs');
const path = require('path');

// ...existing code...

exports.createAdmin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      description: req.body.description,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await admin.save();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json(adminResponse);
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// ...existing code...