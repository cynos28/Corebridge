const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');

// Public (authenticated) routes
router.get('/', auth, getTeachers);
router.get('/:id', auth, getTeacher);

// Protected CRUD with photo upload
router.post('/', auth, upload.single('photo'), createTeacher);
router.put('/:id', auth, upload.single('photo'), updateTeacher);
router.delete('/:id', auth, deleteTeacher);

module.exports = router;