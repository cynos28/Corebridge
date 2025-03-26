const express = require("express");
const router = express.Router();
// Fixed the typo here: "resultController" instead of "resultControlleer"
const ResultController = require("../controllers/resultController");

router.post("/", ResultController.createResult);
router.get("/", ResultController.getAllResults);
router.get("/:id", ResultController.getResultById);
router.put("/:id", ResultController.updateResult);
router.delete("/:id", ResultController.deleteResult);

module.exports = router;
