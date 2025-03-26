const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// Since we only use text fields, we use multer.none() to parse multipart data if sent as FormData
const multer = require("multer");
const upload = multer();

router.post("/", upload.none(), resultController.createResult);
router.get("/", resultController.getResults);
router.get("/:id", resultController.getResultById);
router.put("/:id", upload.none(), resultController.updateResult);
router.delete("/:id", resultController.deleteResult);

module.exports = router;
