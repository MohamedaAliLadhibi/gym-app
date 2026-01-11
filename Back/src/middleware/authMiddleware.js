const authMiddleware = (req, res, next) => {
  // For testing, allow all requests
  // In production, you'll check JWT tokens here
  req.user = { id: 'test-user-id' };
  next();
};

module.exports = authMiddleware;