const express = require("express");

const router = express.Router();

router.use("/users", require("./users.route"));
router.use("/contents", require("./contents.route"));

module.exports = router;
