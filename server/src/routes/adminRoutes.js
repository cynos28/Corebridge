const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Admin, Teacher } = require('../models');

// ...existing code...