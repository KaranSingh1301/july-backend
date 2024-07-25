const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 8000;

//middleware
app.use(express.json());

//db instance
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karan@130101",
  database: "july24testDb",
  multipleStatements: true,
});

//db connection

db.connect((err) => {
  // db.query("CREATE DATABASE testDb", function(err, result)
  // {
  //   if(err) throw err;
  //   console.log("databse has been created")
  // })
  if (err) throw err;

  console.log("Mysql has been connected successfully");
});

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/get-user", (req, res) => {
  db.query("SELECT * FROM user", {}, (err, data) => {
    if (err) console.log(err);
    console.log(data);
    return res.status(200).json(data);
  });
});

app.post("/create-user", (req, res) => {
  console.log(req.body);
  const { id, name, email, password } = req.body;
  db.query(
    `INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)`,
    [id, name, email, password],
    (err, data) => {
      if (err) console.log(err);
      console.log(data);
      return res.status(201).json("User created successfully");
    }
  );
});

app.listen(PORT, () => {
  console.log(`server us running on PORT:${PORT}`);
});

// CREATE TABLE user(
//   id int primary key,
//   name varchar(50),
//   email varchar(50) not null unique,
//   password varchar(30) not null
// );

// SELECT * FROM user;
// INSERT INTO user(id, name, email, password) VALUES(1, "Karan", "k@gmail.com", "123456");
// UPDATE user SET email='Karan@gmail.com' WHERE id=1;
// Delete FROM user where id=1;
