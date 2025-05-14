const redis = require('../config/redis');

const cacheProfile = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const cacheKey = `profile:${role}:${userId}`;
    
    const cachedProfile = await redis.get(cacheKey);
    if (cachedProfile) {
      return res.json(JSON.parse(cachedProfile));
    }
    
    req.redis = redis;
    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = cacheProfile;
