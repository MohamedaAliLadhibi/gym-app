const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Create and manage workouts
router.post('/', workoutController.createWorkout);

router.get('/', workoutController.getUserWorkouts);

router.get('/featured', workoutController.getFeaturedWorkouts);

router.get('/history', workoutController.getWorkoutHistory);

router.get('/stats', workoutController.getWorkoutStatistics);

router.get('/:id', workoutController.getWorkoutById);

router.put('/:id', workoutController.updateWorkout);

router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;
