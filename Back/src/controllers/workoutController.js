const supabaseService = require('../services/supabaseService');

const workoutController = {
  createWorkout: async (req, res) => {
    try {
      const workoutData = req.body;

      const workout = await supabaseService.createWorkout(workoutData);
      
      res.status(201).json({
        success: true,
        message: 'Workout created successfully',
        data: workout
      });

    } catch (error) {
      console.error('❌ Create workout error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  getUserWorkouts: async (req, res) => {
    try {
      const { startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const workouts = await supabaseService.getUserWorkouts(null, {
        startDate,
        endDate,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: workouts
      });

    } catch (error) {
      console.error('❌ Get workouts error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getWorkoutById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const workout = await supabaseService.getWorkoutById(id);
      
      res.json({
        success: true,
        data: workout
      });

    } catch (error) {
      console.error('❌ Get workout error:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  updateWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const workout = await supabaseService.updateWorkout(id, null, updates);
      
      res.json({
        success: true,
        message: 'Workout updated successfully',
        data: workout
      });

    } catch (error) {
      console.error('❌ Update workout error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  deleteWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      
      await supabaseService.deleteWorkout(id, null);
      
      res.json({
        success: true,
        message: 'Workout deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete workout error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  getWorkoutStatistics: async (req, res) => {
    try {
      const { period = 'month' } = req.query;
      
      const stats = await supabaseService.getWorkoutStatistics(null, period);
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('❌ Get workout statistics error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getFeaturedWorkouts: async (req, res) => {
    try {
      const featuredWorkouts = await supabaseService.getFeaturedWorkouts(null);
      
      res.json({
        success: true,
        data: featuredWorkouts
      });

    } catch (error) {
      console.error('❌ Get featured workouts error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getWorkoutHistory: async (req, res) => {
    try {
      const { page = 1, limit = 5 } = req.query;
      
      const history = await supabaseService.getWorkoutHistory(null, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: history
      });

    } catch (error) {
      console.error('❌ Get workout history error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = workoutController;
