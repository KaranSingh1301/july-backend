//ES5
const express = require("express");

const app = express();

//api
app.get("/home", (req, res) => {
  return res.status(400).json("Server is running");
});

//query
// /api?key=val
app.get("/api", (req, res) => {
  console.log(req.query);
  const key = req.query.key;
  return res.send(`API Value of key : ${key}`);
});

// /api1?key1=val1&key2=val2
app.get("/api1", (req, res) => {
  console.log(req.query);
  const { key1, key2 } = req.query;
  return res.send(`API1 Value of key1: ${key1} & key2: ${key2}`);
});

// /api2?key=val1,val2
app.get("/api2", (req, res) => {
  console.log(req.query.key.split(","));
  const Values = req.query.key.split(",");

  const key1 = Values[0];
  const key2 = Values[1];
  const key3 = Values[2];

  return res.send(
    `API1 Value of key1: ${key1} & key2: ${key2} & key3: ${key3}`
  );
});

//params

app.get("/profile/:name", (req, res) => {
  console.log(req.params);
  return res.send("allok");
});
app.get("/profile/:name/:surname", (req, res) => {
  console.log(req.params);
  return res.send("all ok 2");
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
