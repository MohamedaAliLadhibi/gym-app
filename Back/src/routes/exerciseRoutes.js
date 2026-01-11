const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// Public routes
router.get('/', exerciseController.getAllExercises);
router.get('/categories', exerciseController.getExerciseCategories);
router.get('/search', exerciseController.searchExercises);
router.get('/:id', exerciseController.getExerciseById);

module.exports = router;