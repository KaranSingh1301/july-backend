const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const userModel = require("./models/userModel");
const { userDataValidation, isEmailValidate } = require("./utils/authUtils");
const isAuth = require("./middlewares/isAuthMiddleware");

//contants
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const store = new mongodbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

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

    return res.redirect("/login");
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

    //session init
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboardPage");
});

app.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(200).json("Logout successfull");
    }
  });
});

app.post("/logout-out-from-all", isAuth, async (req, res) => {
  console.log(req.session);
  const username = req.session.user.username;

  const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false });
  const sessionModel = mongoose.model("session", sessionSchema);

  try {
    const deleteDb = await sessionModel.deleteMany({
      "session.user.username": username,
    });

    console.log(deleteDb);

    return res
      .status(200)
      .json(`Logout from ${deleteDb.deletedCount} devices successfull`);
  } catch (error) {
    return res.status(500).json(error);
  }

  //model.deleteMany({ username : req.session.user.username})
  return res.send("all ok");
});

app.listen(PORT, () => {
  console.log(`server is running at: http://localhost:${8000}`);
});

//session
//global middleware, initalise the session (req.session)
