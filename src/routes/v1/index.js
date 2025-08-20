const express = require("express");

const router = express.Router();

router.use("/users", require("./users.route"));
router.use("/contents", require("./contents.route"));
router.use("/", require("./auth.route"));

module.exports = router;
