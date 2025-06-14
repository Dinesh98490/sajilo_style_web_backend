const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// routes of the users
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
