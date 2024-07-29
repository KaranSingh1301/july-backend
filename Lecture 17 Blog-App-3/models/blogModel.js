const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");
const ObjectId = require("mongodb").ObjectId;

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new blogSchema({
      title,
      textBody,
      userId,
      creationDateTime: Date.now(),
    });

    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //skip, limit, sort

    try {
      const blogsDb = await blogSchema.aggregate([
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(blogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    //skip, limit, sort, match
    try {
      const myBlogsDb = await blogSchema.aggregate([
        { $match: { userId: userId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(myBlogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) reject("Missing BlogId.");

    if (!ObjectId.isValid(blogId)) reject("Incorrect format of BlogId");

    try {
      const blogDb = await blogSchema.findOne({ _id: blogId });

      if (!blogDb) reject(`blog not found with BlogId : ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }

    resolve();
  });
};

module.exports = { createBlog, getBlogs, getMyBlogs, getBlogWithId };
