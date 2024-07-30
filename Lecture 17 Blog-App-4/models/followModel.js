const followSchema = require("../schemas/followSchema");

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

module.exports = { followUser };
