const express = require("express");
const { followUserController } = require("../controllers/followController");
const followRouter = express.Router();

followRouter.post("/follow-user", followUserController);

module.exports = followRouter;
