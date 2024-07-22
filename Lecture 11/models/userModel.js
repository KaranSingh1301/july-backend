const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userschema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    requried: true,
  },
});

module.exports = mongoose.model("user", userschema);
