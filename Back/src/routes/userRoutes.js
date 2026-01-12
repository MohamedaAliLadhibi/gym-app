const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', userController.getUser);

// POST /api/users/register - Register new user
router.post('/register', userController.register);

// POST /api/users/login - Login user
router.post('/login', userController.login);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;