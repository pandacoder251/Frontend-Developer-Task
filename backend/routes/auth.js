const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateValidation, updateProfile);
router.put('/changepassword', protect, passwordValidation, changePassword);
router.delete('/deleteaccount', protect, deleteAccount);

module.exports = router;

