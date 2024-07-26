const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

module.exports = authRouter;
