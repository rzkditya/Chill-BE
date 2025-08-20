const router = require("express").Router();
const AuthenticationController = require("../../controllers/auth.controller");
const { Middleware } = require("../../middlewares");

router.get(
  "/profile",
  Middleware.authenticate,
  AuthenticationController.profile
);
router.post("/login", AuthenticationController.login);
router.post("/register", AuthenticationController.register);
router.get("/activation/:token", AuthenticationController.activation);
router.post(
  "/upload",
  Middleware.authenticate,
  Middleware.upload.single("file"),
  AuthenticationController.upload
);

module.exports = router;
