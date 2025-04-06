const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
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
