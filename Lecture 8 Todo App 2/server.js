const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//file-imports
const userModel = require("./models/userModel");
const { userDataValidation, isEmailValidate } = require("./utils/authUtils");

//contants
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    //check email exist or not
    const userEmailExist = await userModel.findOne({ email });

    if (userEmailExist) {
      return res.status(400).json("Email already exist.");
    }

    const userUsernameExist = await userModel.findOne({ username });

    if (userUsernameExist) {
      return res.status(400).json("Username already exist.");
    }

    //hash the password

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const userObj = new userModel({
      //schema : client
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
    });

    const userDb = await userObj.save();

    return res
      .status(201)
      .json({ message: "User created successfully", data: userDb });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

//login
app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  const { loginId, password } = req.body;

  //data validation
  if (!loginId || !password)
    return res.status(400).json("Missing user loginId/Password");

  if (typeof loginId !== "string")
    return res.status(400).json("LoginId is not a text");

  if (typeof password !== "string")
    return res.status(400).json("password is not a text");

  try {
    let userDb = {};
    //find the user base on loginId
    if (isEmailValidate({ key: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }

    if (!userDb) {
      return res.status(400).json("User not found, please register first");
    }

    //compare the password

    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.status(400).json("Incorrect password");
    }

    return res.status(200).json("Login successfull");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

app.listen(PORT, () => {
  console.log(`server is running at: http://localhost:${8000}`);
});
