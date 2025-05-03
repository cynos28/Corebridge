const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');

// Get all teachers
router.get('/', auth, getTeachers);

// Get single teacher
router.get('/:id', auth, getTeacher);

// Create new teacher
router.post('/', auth, upload.single('photo'), createTeacher);

// Update teacher
router.put('/:id', auth, upload.single('photo'), updateTeacher);

// Delete teacher
router.delete('/:id', auth, deleteTeacher);

module.exports = router;