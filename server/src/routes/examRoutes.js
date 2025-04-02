const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const multer = require("multer");
const upload = multer(); // no file fields; only text

// CRUD Routes for Exam with upload.none() to parse multipart text fields
router.post("/", upload.none(), examController.createExam);
router.get("/", examController.getExams);
router.get("/:id", examController.getExamById);
router.put("/:id", upload.none(), examController.updateExam);
router.delete("/:id", examController.deleteExam);

module.exports = router;
