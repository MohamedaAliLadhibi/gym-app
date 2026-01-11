const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Record and manage progress
router.post('/',
  validationMiddleware.validateProgress,
  progressController.recordProgress
);

router.get('/',
  progressController.getUserProgress
);

router.get('/exercise/:exercise_id',
  progressController.getExerciseProgress
);

router.get('/personal-records',
  progressController.getPersonalRecords
);

router.get('/stats/overall',
  progressController.getOverallProgressStats
);

router.get('/stats/exercise/:exercise_id',
  progressController.getExerciseProgressStats
);

// Progress charts and analytics
router.get('/charts/weight',
  progressController.getWeightProgressChart
);

router.get('/charts/strength',
  progressController.getStrengthProgressChart
);

router.get('/charts/volume',
  progressController.getVolumeProgressChart
);

router.get('/analytics/comparison',
  progressController.getProgressComparison
);

router.get('/analytics/goals',
  progressController.checkProgressGoals
);

// Goal tracking
router.post('/goals',
  progressController.setProgressGoal
);

router.get('/goals',
  progressController.getProgressGoals
);

router.put('/goals/:id',
  progressController.updateProgressGoal
);

router.delete('/goals/:id',
  progressController.deleteProgressGoal
);

router.get('/goals/achieved',
  progressController.getAchievedGoals
);

module.exports = router;