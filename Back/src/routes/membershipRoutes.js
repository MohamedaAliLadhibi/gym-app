const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

// Public routes
router.get('/types', membershipController.getMembershipTypes);

module.exports = router;