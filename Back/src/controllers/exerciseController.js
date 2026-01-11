const supabaseService = require('../services/supabaseService');
const { validationResult } = require('express-validator');

// Try to import storage service with fallback
let storageService;
try {
  storageService = require('../services/storageService');
} catch (error) {
  console.log('📁 Storage service not found, using mock');
  storageService = {
    uploadExerciseImage: async (file) => {
      console.log(`📁 [Mock] Would upload exercise image: ${file?.originalname}`);
      return 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Exercise+Image';
    }
  };
}

const exerciseController = {
  // Get all exercises
  getAllExercises: async (req, res) => {
    try {
      const { 
        category, 
        difficulty, 
        muscle_group, 
        equipment,
        search,
        page = 1,
        limit = 20 
      } = req.query;

      // Build query
      let query = supabaseService.supabase
        .from('exercises')
        .select('*');

      // Apply filters
      if (category) query = query.eq('category', category);
      if (difficulty) query = query.eq('difficulty', difficulty);
      if (muscle_group) query = query.eq('muscle_group', muscle_group);
      if (equipment) query = query.eq('equipment', equipment);
      if (search) query = query.ilike('name', `%${search}%`);

      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;

      res.json({
        success: true,
        data: data || []
      });

    } catch (error) {
      console.error('Get exercises error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get exercises'
      });
    }
  },

  // Get exercise by ID
  getExerciseById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const { data: exercise, error } = await supabaseService.supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      res.json({
        success: true,
        data: exercise
      });

    } catch (error) {
      console.error('Get exercise error:', error);
      res.status(404).json({
        success: false,
        error: 'Exercise not found'
      });
    }
  },

  // Create exercise (admin) - SIMPLIFIED
  createExercise: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      let exerciseData = req.body;
      
      // Handle image upload if file exists
      if (req.file) {
        const imageUrl = await storageService.uploadExerciseImage(req.file);
        exerciseData.img_url = imageUrl;
      } else {
        // Default image if none provided
        exerciseData.img_url = exerciseData.img_url || 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Exercise+Image';
      }

      // Create exercise
      const { data: exercise, error } = await supabaseService.supabase
        .from('exercises')
        .insert([exerciseData])
        .select()
        .single();

      if (error) throw error;
      
      res.status(201).json({
        success: true,
        message: 'Exercise created successfully',
        data: exercise
      });

    } catch (error) {
      console.error('Create exercise error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create exercise'
      });
    }
  },

  // Get exercise categories
  getExerciseCategories: async (req, res) => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exercises')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;
      
      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
      
      res.json({
        success: true,
        data: categories
      });

    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get categories'
      });
    }
  },

  // Search exercises
  searchExercises: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.json({
          success: true,
          data: []
        });
      }

      const { data, error } = await supabaseService.supabase
        .from('exercises')
        .select('*')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
        .limit(10);

      if (error) throw error;
      
      res.json({
        success: true,
        data: data || []
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed'
      });
    }
  }
};

module.exports = exerciseController;