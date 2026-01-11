const supabaseService = require('../services/supabaseService');

const dashboardController = {
  // Get user dashboard data
  getUserDashboard: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const dashboard = await supabaseService.getUserDashboard(userId);
      
      res.json({
        success: true,
        data: dashboard
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get admin dashboard (admin only)
  getAdminDashboard: async (req, res) => {
    try {
      const stats = await supabaseService.getAdminDashboardStats();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get workout calendar
  getWorkoutCalendar: async (req, res) => {
    try {
      const userId = req.user.id;
      const { year, month } = req.query;
      
      const calendar = await supabaseService.getWorkoutCalendar(userId, year, month);
      
      res.json({
        success: true,
        data: calendar
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;