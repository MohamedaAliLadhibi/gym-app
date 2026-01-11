const supabaseService = require('../services/supabaseService');
const { validationResult } = require('express-validator');

const progressController = {
  // Record progress for an exercise
  recordProgress: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const progressData = {
        ...req.body,
        user_id: userId
      };

      const progress = await supabaseService.recordProgress(progressData);
      
      // Check if it's a personal record
      const isPR = await supabaseService.checkPersonalRecord(userId, progressData.exercise_id, progressData.max_weight);
      
      res.status(201).json({
        success: true,
        message: isPR ? 'New personal record! 🎉' : 'Progress recorded successfully',
        data: {
          ...progress,
          is_personal_record: isPR
        }
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get user progress for exercise
  getExerciseProgress: async (req, res) => {
    try {
      const userId = req.user.id;
      const { exercise_id } = req.params;
      const { startDate, endDate } = req.query;
      
      const progress = await supabaseService.getExerciseProgress(
        userId, 
        exercise_id, 
        { startDate, endDate }
      );
      
      res.json({
        success: true,
        data: progress
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get personal records
  getPersonalRecords: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const records = await supabaseService.getPersonalRecords(userId);
      
      res.json({
        success: true,
        data: records
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get progress statistics
  getProgressStatistics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { period = 'month' } = req.query;
      
      const stats = await supabaseService.getProgressStatistics(userId, period);
      
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

module.exports = progressController;