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

// Define routes with auth and upload middleware
router.get('/', auth, getTeachers);
router.get('/:id', auth, getTeacher);
router.post('/', auth, upload.single('photo'), createTeacher);
router.put('/:id', auth, upload.single('photo'), updateTeacher);
router.delete('/:id', auth, deleteTeacher);

module.exports = router;
