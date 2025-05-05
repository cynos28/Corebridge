const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder for storing files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware to check teacher authorization
const authorizeTeacher = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is a teacher or admin
    if (decoded.role !== 'teacher' && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers and admins can perform this action' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Protected routes for teachers
router.post("/", upload.single("document"), authorizeTeacher, assignmentController.createAssignment);
router.put("/:id", upload.single("document"), authorizeTeacher, assignmentController.updateAssignment);
router.delete("/:id", authorizeTeacher, assignmentController.deleteAssignment);

// Public routes 
router.get("/", assignmentController.getAssignments);
router.get("/:id", assignmentController.getAssignmentById);

module.exports = router;
