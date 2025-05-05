const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorizeTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(401).json({ message: 'Unauthorized: Teacher access required' });
  }
  next();
};