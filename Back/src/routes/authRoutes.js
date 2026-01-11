const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Password reset and recovery
router.post('/forgot-password',
  authController.forgotPassword
);

router.post('/reset-password',
  authController.resetPassword
);

router.post('/verify-email',
  authController.sendVerificationEmail
);

router.post('/verify-email/:token',
  authController.verifyEmail
);

// Session management
router.get('/sessions',
  authMiddleware,
  authController.getActiveSessions
);

router.delete('/sessions/:sessionId',
  authMiddleware,
  authController.revokeSession
);

router.delete('/sessions/all',
  authMiddleware,
  authController.revokeAllSessions
);

// Two-factor authentication
router.post('/2fa/enable',
  authMiddleware,
  authController.enableTwoFactor
);

router.post('/2fa/disable',
  authMiddleware,
  authController.disableTwoFactor
);

router.post('/2fa/verify',
  authController.verifyTwoFactor
);

// Social auth callbacks (if implementing social login)
router.get('/google/callback',
  authController.googleAuthCallback
);

router.get('/facebook/callback',
  authController.facebookAuthCallback
);

module.exports = router;