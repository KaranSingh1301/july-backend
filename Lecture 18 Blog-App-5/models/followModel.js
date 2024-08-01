const { LIMIT } = require("../privateConstants");
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followObj = new followSchema({
        followerUserId,
        followingUserId,
      });

      const followDb = await followObj.save();

      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowingList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const followingListDb = await followSchema
      //   .find({ followerUserId })
      //   .populate("followingUserId")

      const followingListDb = await followSchema.aggregate([
        { $match: { followerUserId: followerUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followingUserIds = followingListDb.map(
        (item) => item.followingUserId
      );

      console.log(followingListDb);
      console.log(followingUserIds);

      const followingUserDetails = await userSchema.find({
        _id: { $in: followingUserIds },
      });

      console.log(followingUserDetails);

      resolve(followingUserDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteDb = await followSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });

      resolve(deleteDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, getFollowingList, unfollowUser };