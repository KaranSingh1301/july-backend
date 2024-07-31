const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  //userA--->userB
  followerUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  followingUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  creationDateTime: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("follow", followSchema);
