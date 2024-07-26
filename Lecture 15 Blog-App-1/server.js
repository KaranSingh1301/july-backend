const express = require("express");
require("dotenv").config();
const clc = require("cli-color");

//file-imports
const db = require("./db");
const authRouter = require("./routers/authRouter");

//contants
const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Server is up and running!",
  });
});

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.bold.underline(`server is running on PORT:${PORT}`)
  );
});
