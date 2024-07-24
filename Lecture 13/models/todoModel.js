const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todo: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
    trim: true,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("todo", todoSchema);
