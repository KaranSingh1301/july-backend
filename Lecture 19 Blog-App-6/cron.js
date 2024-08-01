const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

const cleanUpBin = () => {
  cron.schedule("* * 0 * * *", async () => {
    //compute the deletionDateTime
    // diff > 30 days
    //delete permentantly

    try {
      //find all the blogs which has been marked deleted
      const markedDeletedBlogs = await blogSchema.find({ isDeleted: true });
      console.log(markedDeletedBlogs);

      if (markedDeletedBlogs.length !== 0) {
        let deletedBlogIds = [];

        //find out the blogs > 30 days
        markedDeletedBlogs.map((blog) => {
          const diff =
            (Date.now() - blog.deletionDateTime) / (1000 * 60 * 60 * 24);

          if (diff > 30) {
            deletedBlogIds.push(blog._id);
          }
        });

        if (deletedBlogIds.length !== 0) {
          const deleteDb = await blogSchema.findOneAndDelete({
            _id: { $in: deletedBlogIds },
          });
          console.log(`Blog has been deleted successfully : ${deleteDb._id}`);
        }

        console.log(deletedBlogIds);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = cleanUpBin;
