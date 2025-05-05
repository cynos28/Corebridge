const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { auth, authorizeTeacher } = require('../middleware/auth');
const ac = require('../controllers/assignmentController');

// Ensure upload dirs
const uploadsDir     = path.join(__dirname, '../uploads');
const submissionsDir = path.join(__dirname, '../uploads/submissions');
[uploadsDir, submissionsDir].forEach(d => fs.existsSync(d) || fs.mkdirSync(d, { recursive: true }));

// Multer configs...
const uploadAssignment = multer({ dest: uploadsDir });
const uploadSubmission = multer({ dest: submissionsDir });

const router = express.Router();
router.use(auth);
router.get('/', ac.getAssignments);
router.get('/:id', ac.getAssignmentById);
router.get('/:id/download', ac.downloadAssignment);
router.post('/:id/submit', uploadSubmission.single('submission'), ac.submitAssignment);
router.get('/:id/submission/download', ac.downloadSubmission);

router.post('/', authorizeTeacher, uploadAssignment.single('document'), ac.createAssignment);
router.put('/:id', authorizeTeacher, uploadAssignment.single('document'), ac.updateAssignment);
router.delete('/:id', authorizeTeacher, ac.deleteAssignment);
router.post('/:id/grade', authorizeTeacher, ac.gradeSubmission);

module.exports = router;