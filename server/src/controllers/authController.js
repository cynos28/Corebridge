const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher= require('../models/Teacher');
const Admin  = require('../models/Admin');
const Student= require('../models/Student');
const User   = require('../models/User');

// Login handler
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user;
    switch (role) {
      case 'teacher': user = await Teacher.findOne({ email }); break;
      case 'admin':   user = await Admin.findOne({ email });   break;
      case 'student': user = await Student.findOne({ email }); break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id, role: role, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    const userObj = user.toObject(); delete userObj.password;
    res.json({ token, user: { ...userObj, role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Initialize default admin
exports.initAdmin = async () => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (!exists) {
      const passHash = await bcrypt.hash('admin@1122', 10);
      await User.create({ email: 'shedul0000@gmail.com', password: passHash, role: 'admin' });
      console.log('Admin initialized');
    }
  } catch (err) {
    console.error('Error initializing admin:', err);
  }
};