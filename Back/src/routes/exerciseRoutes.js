const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// Public routes (no auth for now)
router.get('/', exerciseController.getAll);
router.get('/:id', exerciseController.getOne);
router.post('/', exerciseController.create);
router.put('/:id', exerciseController.update);
router.delete('/:id', exerciseController.delete);

module.exports = router;