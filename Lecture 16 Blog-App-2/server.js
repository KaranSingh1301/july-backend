const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const db = require("./db");
const authRouter = require("./routers/authRouter");

//contants
const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.bold.underline(`server is running on PORT:${PORT}`)
  );
});
