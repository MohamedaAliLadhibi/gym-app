const supabaseService = require('../services/supabaseService');

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Check if user is admin
    const user = await supabaseService.getUserById(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authorization check failed'
    });
  }
};

module.exports = adminMiddleware;