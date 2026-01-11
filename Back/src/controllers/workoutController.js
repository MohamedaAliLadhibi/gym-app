const supabaseService = require('../services/supabaseService');
const { validationResult } = require('express-validator');

const workoutController = {
  // Create workout
  createWorkout: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const workoutData = {
        ...req.body,
        user_id: req.user.id
      };

      const workout = await supabaseService.createWorkout(workoutData);
      
      res.status(201).json({
        success: true,
        message: 'Workout created successfully',
        data: workout
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get user workouts
  getUserWorkouts: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate, page = 1, limit = 20 } = req.query;
      
      const workouts = await supabaseService.getUserWorkouts(userId, {
        startDate,
        endDate,
        page,
        limit
      });
      
      res.json({
        success: true,
        data: workouts
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get workout by ID
  getWorkoutById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const workout = await supabaseService.getWorkoutById(id, userId);
      
      res.json({
        success: true,
        data: workout
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update workout
  updateWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updates = req.body;
      
      const workout = await supabaseService.updateWorkout(id, userId, updates);
      
      res.json({
        success: true,
        message: 'Workout updated successfully',
        data: workout
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete workout
  deleteWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      await supabaseService.deleteWorkout(id, userId);
      
      res.json({
        success: true,
        message: 'Workout deleted successfully'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get workout statistics
  getWorkoutStatistics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { period = 'month' } = req.query;
      
      const stats = await supabaseService.getWorkoutStatistics(userId, period);
      
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
  }
};

module.exports = workoutController;