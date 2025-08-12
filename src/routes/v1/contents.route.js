const express = require("express");

const contentsController = require("../../controllers/contents.controller");

const router = express.Router();

router.post("/", contentsController.create);
router.get("/", contentsController.getContents);
router.get("/:id", contentsController.getContentsById);
router.patch("/:id", contentsController.updateContentsById);
router.delete("/:id", contentsController.deleteContentsById);

module.exports = router;
