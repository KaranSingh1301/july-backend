const express = require("express");
const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
} = require("../controllers/blogController");
const isAuth = require("../middlewares/isAuthMiddleware");

const blogRouter = express.Router();

blogRouter
  .get("/get-blogs", isAuth, getBlogsController)
  .get("/get-myBlogs", isAuth, getMyBlogsController)
  .post("/create-blog", isAuth, createBlogController)
  .post("/edit-blog", isAuth, editBlogController)
  .post("/delete-blog", isAuth, deleteBlogController);

module.exports = blogRouter;
