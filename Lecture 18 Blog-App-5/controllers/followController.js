const {
  followUser,
  getFollowingList,
  unfollowUser,
} = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;
  try {
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid following userId",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followingUserId, followerUserId });

    return res.send({
      status: 201,
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowingListController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    const followingListDb = await getFollowingList({ followerUserId, SKIP });

    if (followingListDb.length === 0) {
      return res.send({
        status: 203,
        message: "No following found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: followingListDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const unfollowUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    const deleteDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow successfull",
      data: deleteDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  followUserController,
  getFollowingListController,
  unfollowUserController,
};

//test-->test1
//test-->test2
//test-->test3
//test-->test4
//test1-->test
//test2--->test

//test(4, 2)
