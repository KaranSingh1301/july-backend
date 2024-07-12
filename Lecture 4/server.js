const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userModel = require("./userSchema");

const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/julyTestDb";

//middleware
app.use(express.json()); //axios, postman
// app.use(express.urlencoded({extended : true}))     /html form

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.send("Server is running");
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

app.listen(8000, () => {
  console.log("server is running on PORT : 8000");
});
