const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

//contants
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.send("Server is up and running...");
});

//registeration
app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", (req, res) => {
  console.log(req.body);

  //email and username should be unique  .findOne({key : val})

  //userschema
  //obj
  //.save

  return res.send("Register success");
});

//login
app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", (req, res) => {
  return res.send("login success");
});

app.listen(PORT, () => {
  console.log(`server is running at: http://localhost:${8000}`);
});
