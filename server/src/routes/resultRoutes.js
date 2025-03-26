// routes/resultRoutes.js
const express = require("express");
const router = express.Router();
const ResultController = require("../controllers/resultControlleer");

// Define your routes
router.post("/", ResultController.createResult);
router.get("/", ResultController.getAllResults);
router.get("/:id", ResultController.getResultById);
router.put("/:id", ResultController.updateResult);
router.delete("/:id", ResultController.deleteResult);

// Export the router instance directly
module.exports = router;
