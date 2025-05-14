const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const redis = require('../config/redis');

// Helper function to get role-specific profile
const getRoleSpecificProfile = async (userId, role) => {
  let profile;
  switch (role) {
    case 'teacher':
      profile = await Teacher.findById(userId).select('firstName lastName photoUrl').lean();
      break;
    case 'admin':
      profile = await Admin.findById(userId).select('firstName lastName photoUrl').lean();
      break;
    case 'student':
      profile = await Student.findById(userId).select('firstName lastName photoUrl').lean();
      break;
  }
  return profile || {};
};

// Helper function to update last login
const updateLastLogin = async (userId) => {
  await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Single query to User model with role check
    const user = await User.findOne({ email, role })
      .select('_id email password role isActive')
      .lean();

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Password verification
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get role-specific data in parallel if needed
    const [profile] = await Promise.all([
      getRoleSpecificProfile(user._id, role),
      updateLastLogin(user._id)
    ]);

    // Create token payload
    const payload = {
      userId: user._id,
      role: role,
      email: user.email
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Cache the profile data
    const cacheKey = `profile:${role}:${user._id}`;
    await redis.setex(cacheKey, 300, JSON.stringify(profile)); // Cache for 5 minutes

    // Set cache headers
    res.set('Cache-Control', 'private, no-cache');

    res.json({
      token,
      user: {
        ...profile,
        _id: user._id,
        email: user.email,
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
