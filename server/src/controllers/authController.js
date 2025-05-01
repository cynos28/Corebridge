const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Student = require('../models/Student'); // Add Student model

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    // Find user based on role
    switch (role) {
      case 'teacher':
        user = await Teacher.findOne({ email });
        break;
      case 'admin':
        user = await Admin.findOne({ email });
        break;
      case 'student':
        user = await Student.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token payload
    const payload = {
      userId: user._id,
      role: role,
      email: user.email
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: {
        ...userResponse,
        role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Initialize admin user
exports.initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'shedul0000@gmail.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin@1122', 10);
      await User.create({
        email: 'shedul0000@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};
