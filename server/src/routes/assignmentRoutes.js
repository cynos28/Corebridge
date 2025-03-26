const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const multer = require("multer");
const path = require("path");

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

// CRUD Routes
router.post("/", upload.single("document"), assignmentController.createAssignment);
router.get("/", assignmentController.getAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.put("/:id", upload.single("document"), assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
