const express = require("express");

const usersController = require("../../controllers/users.controller");

const router = express.Router();

router.post("/", usersController.create);
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUsersById);
router.patch("/:id", usersController.updateUsersById);
router.delete("/:id", usersController.deleteUsersById);

module.exports = router;
