const express = require("express");
const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
} = require("../controllers/blogController");
const isAuth = require("../middlewares/isAuthMiddleware");

const blogRouter = express.Router();

blogRouter
  .get("/get-blogs", isAuth, getBlogsController)
  .get("/get-myBlogs", isAuth, getMyBlogsController)
  .post("/create-blog", isAuth, createBlogController)
  .post("/edit-blog", isAuth, editBlogController);

module.exports = blogRouter;
