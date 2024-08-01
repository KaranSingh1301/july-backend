const { response } = require("express");
const {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlogId,
} = require("../models/blogModel");
const blogDataValidate = require("../utils/blogUtil");
const { getFollowingList } = require("../models/followModel");

const createBlogController = async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  //data validation

  try {
    await blogDataValidate({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: error,
    });
  }

  //store the data in db
  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

// blog/get-blogs?skip=5
const getBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const followerUserId = req.session.user.userId;

  try {
    const followingUserList = await getFollowingList({ followerUserId, SKIP });

    const followingUserIds = followingUserList.map((item) => item._id);

    const blogsDb = await getBlogs({ followingUserIds, SKIP });

    if (blogsDb.length === 0)
      return res.send({
        status: 204,
        message: "No blog found",
      });

    return res.send({
      status: 200,
      message: "Read success",
      data: blogsDb,
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

const getMyBlogsController = async (req, res) => {
  const userId = req.session.user.userId;
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    const myBlogsDb = await getMyBlogs({ SKIP, userId });

    if (myBlogsDb.length === 0) {
      return res.send({
        status: 204,
        message: "No blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb,
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

const editBlogController = async (req, res) => {
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;

  //data validation

  try {
    await blogDataValidate({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: error,
    });
  }

  try {
    const blogDb = await getBlogWithId({ blogId });

    //ownership check
    //id1.toString() === id2.toString()
    //id1.equals(id2)
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowd to edit the blog",
      });
    }

    //check if 30mins or not
    console.log((Date.now() - blogDb.creationDateTime) / (1000 * 60));

    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allowed to edit the blog after 30 mins of creation",
      });
    }

    const blogDbNew = await editBlogWithId({ title, textBody, blogId });

    return res.send({
      status: 200,
      message: "Blog updated successfully",
      data: blogDbNew,
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

const deleteBlogController = async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });

    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to delete the blog",
      });
    }

    const deletedBlogDb = await deleteBlogId({ blogId });

    return res.send({
      status: 200,
      message: "Blog deleted successfully",
      data: deletedBlogDb,
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
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
};
