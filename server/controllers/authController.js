const User = require('../models/User');
const Admin = require('../src/models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check if it's an admin login
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          userId: admin._id,
          role: 'admin',
          email: admin.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: admin._id,
          email: admin.email,
          role: 'admin',
          name: admin.name,
          photoUrl: admin.photoUrl
        }
      });
    }

    // If not admin, check regular user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify role matches
    if (user.role !== 'user') {
      return res.status(401).json({ message: 'Invalid role for this user' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
