const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../src/controllers/teacherController');

// Get all teachers
router.get('/', getTeachers);

// Get single teacher
router.get('/:id', getTeacher);

// Create new teacher
router.post('/', createTeacher);

// Update teacher
router.put('/:id', updateTeacher);

// Delete teacher
router.delete('/:id', deleteTeacher);

module.exports = router;