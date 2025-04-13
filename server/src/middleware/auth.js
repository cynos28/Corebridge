const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        status: 'error',
        message: 'No auth token, authorization denied' 
      });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authorization token is required'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user info to request
      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error during authentication'
    });
  }
};

module.exports = auth;
