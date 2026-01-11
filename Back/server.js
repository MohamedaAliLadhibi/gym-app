const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GymApp API'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Import routes with error handling
const loadRoute = (path, routeName) => {
  try {
    const route = require(path);
    return route;
  } catch (error) {
    console.log(`⚠️  ${routeName} routes not loaded:`, error.message);
    return null;
  }
};

// Load routes
const userRoutes = loadRoute('./src/routes/userRoutes', 'User');
const exerciseRoutes = loadRoute('./src/routes/exerciseRoutes', 'Exercise');
const membershipRoutes = loadRoute('./src/routes/membershipRoutes', 'Membership');

// Use routes if they loaded successfully
if (userRoutes) {
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
}

if (exerciseRoutes) {
  app.use('/api/exercises', exerciseRoutes);
  console.log('✅ Exercise routes loaded');
}

if (membershipRoutes) {
  app.use('/api/memberships', membershipRoutes);
  console.log('✅ Membership routes loaded');
}

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'GymApp API',
    endpoints: {
      users: '/api/users',
      exercises: '/api/exercises',
      memberships: '/api/memberships'
    }
  });
});

// 404 handler - FIXED: Use a function for wildcard route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`👤 Users: http://localhost:${PORT}/api/users`);
  console.log(`💪 Exercises: http://localhost:${PORT}/api/exercises`);
  console.log(`💰 Memberships: http://localhost:${PORT}/api/memberships`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/test`);
  console.log(`  GET  /api`);
  console.log(`  POST /api/users/register`);
  console.log(`  POST /api/users/login`);
  console.log(`  GET  /api/users/profile`);
  console.log(`  GET  /api/exercises`);
  console.log(`  GET  /api/exercises/:id`);
  console.log(`  GET  /api/memberships/types`);
});