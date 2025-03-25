const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

router.post("/", (req, res) => examController.createExam(req, res));
router.get("/", (req, res) => examController.getExams(req, res));
router.get("/:id", (req, res) => examController.getExamById(req, res));
router.put("/:id", (req, res) => examController.updateExam(req, res));
router.delete("/:id", (req, res) => examController.deleteExam(req, res));

module.exports = router;
