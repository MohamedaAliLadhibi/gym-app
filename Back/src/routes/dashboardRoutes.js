const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// User dashboard routes
router.get('/user',
  authMiddleware,
  dashboardController.getUserDashboard
);

router.get('/user/quick-stats',
  authMiddleware,
  dashboardController.getUserQuickStats
);

router.get('/user/upcoming',
  authMiddleware,
  dashboardController.getUpcomingWorkouts
);

router.get('/user/recommendations',
  authMiddleware,
  dashboardController.getWorkoutRecommendations
);

router.get('/user/achievements',
  authMiddleware,
  dashboardController.getUserAchievements
);

// Admin dashboard routes
router.get('/admin',
  authMiddleware,
  adminMiddleware,
  dashboardController.getAdminDashboard
);

router.get('/admin/users-stats',
  authMiddleware,
  adminMiddleware,
  dashboardController.getAdminUsersStats
);

router.get('/admin/revenue-stats',
  authMiddleware,
  adminMiddleware,
  dashboardController.getAdminRevenueStats
);

router.get('/admin/workout-stats',
  authMiddleware,
  adminMiddleware,
  dashboardController.getAdminWorkoutStats
);

router.get('/admin/engagement',
  authMiddleware,
  adminMiddleware,
  dashboardController.getUserEngagementStats
);

// Calendar and scheduling
router.get('/calendar',
  authMiddleware,
  dashboardController.getWorkoutCalendar
);

router.get('/calendar/:year/:month',
  authMiddleware,
  dashboardController.getMonthlyCalendar
);

router.post('/calendar/events',
  authMiddleware,
  dashboardController.addCalendarEvent
);

// Notifications
router.get('/notifications',
  authMiddleware,
  dashboardController.getUserNotifications
);

router.put('/notifications/:id/read',
  authMiddleware,
  dashboardController.markNotificationRead
);

router.delete('/notifications/:id',
  authMiddleware,
  dashboardController.deleteNotification
);

router.post('/notifications/clear-all',
  authMiddleware,
  dashboardController.clearAllNotifications
);

module.exports = router;