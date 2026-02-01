const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Create and manage workouts
router.post('/',
  validationMiddleware.validateWorkout,
  workoutController.createWorkout
);

router.get('/',
  workoutController.getUserWorkouts
);

router.get('/:id',
  workoutController.getWorkoutById
);

router.put('/:id',
  workoutController.updateWorkout
);

router.delete('/:id',
  workoutController.deleteWorkout
);

// Workout templates
router.post('/templates',
  workoutController.createWorkoutTemplate
);

router.get('/templates',
  workoutController.getWorkoutTemplates
);

router.get('/templates/:id',
  workoutController.getWorkoutTemplateById
);

router.put('/templates/:id',
  workoutController.updateWorkoutTemplate
);

router.delete('/templates/:id',
  workoutController.deleteWorkoutTemplate
);

router.post('/templates/:id/use',
  workoutController.useWorkoutTemplate
);

// Workout statistics and analytics
router.get('/stats/daily',
  workoutController.getDailyWorkoutStats
);

router.get('/stats/weekly',
  workoutController.getWeeklyWorkoutStats
);

router.get('/stats/monthly',
  workoutController.getMonthlyWorkoutStats
);

router.get('/analytics/trends',
  workoutController.getWorkoutTrends
);

router.get('/analytics/performance',
  workoutController.getPerformanceAnalytics
);

module.exports = router;