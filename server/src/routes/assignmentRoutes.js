const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, authorizeTeacher } = require('../middleware/auth');
const ac = require('../controllers/assignmentController');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
fs.existsSync(uploadsDir) || fs.mkdirSync(uploadsDir, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF files only
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();
router.use(auth);
router.get('/', ac.getAssignments);
router.get('/:id', ac.getAssignmentById);
router.get('/:id/download', ac.downloadAssignment);
router.post('/:id/submit', upload.single('submission'), ac.submitAssignment);
router.get('/:id/submission/download', ac.downloadSubmission);

router.post('/', authorizeTeacher, upload.single('document'), ac.createAssignment);
router.put('/:id', authorizeTeacher, upload.single('document'), ac.updateAssignment);
router.delete('/:id', authorizeTeacher, ac.deleteAssignment);
router.post('/:id/grade', authorizeTeacher, ac.gradeSubmission);

module.exports = router;