const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/authController");
const isAuth = require("../middlewares/isAuthMiddleware");
const authRouter = express.Router();

authRouter
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", isAuth, logoutController);

module.exports = authRouter;
