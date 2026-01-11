const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All routes require admin privileges
router.use(authMiddleware, adminMiddleware);

// User management
router.get('/users/search',
  adminController.searchUsers
);

router.post('/users/:id/ban',
  adminController.banUser
);

router.post('/users/:id/unban',
  adminController.unbanUser
);

router.post('/users/:id/reset-password',
  adminController.resetUserPassword
);

// Content moderation
router.get('/reported-content',
  adminController.getReportedContent
);

router.post('/content/:id/approve',
  adminController.approveContent
);

router.post('/content/:id/reject',
  adminController.rejectContent
);

router.delete('/content/:id',
  adminController.deleteContent
);

// System management
router.get('/system/stats',
  adminController.getSystemStats
);

router.get('/system/logs',
  adminController.getSystemLogs
);

router.post('/system/backup',
  adminController.createBackup
);

router.post('/system/cleanup',
  adminController.cleanupSystem
);

// Email management
router.post('/email/broadcast',
  adminController.sendBroadcastEmail
);

router.get('/email/templates',
  adminController.getEmailTemplates
);

router.post('/email/templates',
  adminController.createEmailTemplate
);

// Analytics exports
router.get('/analytics/export/users',
  adminController.exportUsersAnalytics
);

router.get('/analytics/export/workouts',
  adminController.exportWorkoutsAnalytics
);

router.get('/analytics/export/revenue',
  adminController.exportRevenueAnalytics
);

module.exports = router;