const express = require("express");
const router = require("./router");

const app = express();

// /auth/login
// /auth/register

app.use("/auth", router);

//example for router

//example for middleware

// const fun = (req, res, next) => {
//   console.log("hii from  middleware");
//   next();
// };

// app.use(fun);

// app.get("/", (req, res) => {
//   return res.send("server is running / api");
// });

// app.get("/home", fun, (req, res) => {
//   return res.send("home api");
// });

app.listen(8000, () => {
  console.log("server is running on PORT : 8000");
});
