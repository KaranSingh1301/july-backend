const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-import
const userModel = require("./userSchema");

//constants
const app = express();
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/julyTestDb";

const store = new mongodbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middleware
app.use(express.json()); //axios, postman
app.use(express.urlencoded({ extended: true })); //html form url encoded

app.use(
  session({
    secret: "This is july backend module.",
    store: store,
    saveUninitialized: false,
    resave: false,
  })
);

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/get-form", (req, res) => {
  return res.send(`
    <form action='/create-user' method='POST'>
    <h1>User Form</h1>
        <label for="name">name:</label>
        <input type="text" id="name" name="name">
        <br>
        <label for="email">email:</label>
        <input type="text" id="email" name="email">
        <br>
        <label for="age">age:</label>
        <input type="text" id="age" name="age">
        <br>       
        <label for="password">password:</label>
        <input type="text" id="password" name="password">
        <br>
        <button type="submit">Submit</button>
    </form>
    `);
});

app.post("/create-user", async (req, res) => {
  console.log(req.body);

  const { name, email, password, age } = req.body;

  if (!email) {
    return res.status(400).json("Email is missing");
  }

  // const userdb = await userModel.create({ name: name, email: email, password: password, age: age });

  const userObj = new userModel({
    //schema : client
    name: name,
    email: email,
    password: password,
    age: age,
  });

  console.log(userObj);
  try {
    const userDb = await userObj.save();

    return res.status(201).json(userDb);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//login

app.get("/login", (req, res) => {
  return res.send(`
    <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
      <h1>Login Form </h1>
          <form action='/login' method='POST'>
              <label for="email">email:</label>
              <input type="text" id="email" name="email">
              <br>
              <label for="password">password:</label>
              <input type="text" id="password" name="password">
              <br>
              <button type="submit">Submit</button>
          </form>
      </body>
      </html>
    `);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    //find the user from db
    const userDb = await userModel.findOne({ email: req.body.email });

    //if user doesn't exist
    if (!userDb) {
      return res.status(400).json("User not found, please register first");
    }

    //compare the password
    if (req.body.password !== userDb.password) {
      return res.status(400).json("Incorrect password");
    }

    console.log(req.session);
    req.session.isAuth = true;

    return res.status(200).json("Login successfull");
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.listen(8000, () => {
  console.log("server is running on PORT : 8000");
});
