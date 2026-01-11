const supabaseService = require('../services/supabaseService');
const { validationResult } = require('express-validator');

// Try to import email service, but provide fallback if it doesn't exist
let emailService;
try {
  emailService = require('../services/emailService');
} catch (error) {
  console.log('📧 Email service not found, using mock');
  emailService = {
    sendWelcomeEmail: async (email, name) => {
      console.log(`📧 [Mock] Welcome email would be sent to ${email} for ${name}`);
      return true;
    },
    sendPasswordResetEmail: async (email, token) => {
      console.log(`📧 [Mock] Password reset email would be sent to ${email}`);
      return true;
    }
  };
}

const userController = {
  // Register new user
  registerUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password, full_name, ...userData } = req.body;
      
      // Check if user exists
      const existingUser = await supabaseService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Create user
      const newUser = await supabaseService.createUser({
        email,
        password_hash: password, // Will be hashed in service
        full_name,
        ...userData
      });

      // Send welcome email (in background, don't await)
      emailService.sendWelcomeEmail(email, full_name).catch(console.error);

      // Generate JWT token
      const token = supabaseService.generateToken(newUser.id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            membership_type: newUser.membership_type_id
          },
          token
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await supabaseService.authenticateUser(email, password);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const token = supabaseService.generateToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            membership_type: user.membership_type_id
          },
          token
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await supabaseService.getUserById(userId);
      
      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;
      
      const updatedUser = await supabaseService.updateUser(userId, updates);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete user account
  deleteUserAccount: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await supabaseService.deleteUser(userId);
      
      res.json({
        success: true,
        message: 'Account deleted successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 20, search } = req.query;
      
      const users = await supabaseService.getAllUsers({ page, limit, search });
      
      res.json({
        success: true,
        data: users
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = userController;