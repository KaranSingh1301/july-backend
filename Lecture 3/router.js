const express = require("express");
const { loginController, registerController } = require("./controller");

const router = express.Router();

router.get("/login", loginController);

router.get("/register", registerController);

// /auth/register

module.exports = router;
