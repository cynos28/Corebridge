const express = require('express');
const { body } = require('express-validator');
const { login } = require('../controllers/authController');
const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['admin','teacher','student']).withMessage('Invalid role')
  ],
  login
);

module.exports = router;