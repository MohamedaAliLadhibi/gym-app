const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "LOADED" : "MISSING");


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

// Import routes (DIRECTLY — no loader)
const userRoutes = require('./src/routes/userRoutes');
const exerciseRoutes = require('./src/routes/exerciseRoutes');
const membershipRoutes = require('./src/routes/membershipRoutes');
const wourkoutRoutes = require('./src/routes/workoutRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/workouts', wourkoutRoutes);


// API Documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'GymApp API',
    endpoints: {
      users: '/api/users',
      exercises: '/api/exercises',
      memberships: '/api/memberships',
      workouts: '/api/workouts'
    }
  });
});

// 404 handler
app.use((req, res) => {
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
