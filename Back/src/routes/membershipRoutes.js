const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

// Public routes
router.get('/', membershipController.getAll);
router.get('/:id', membershipController.getOne);
router.post('/', membershipController.create);
router.put('/:id', membershipController.update);
router.delete('/:id', membershipController.delete);

module.exports = router;