const blogDataValidate = ({ title, textBody }) => {
  return new Promise((resolve, reject) => {
    if (!title || !textBody) reject("Missing Blog Data");

    if (typeof title !== "string") reject("title is not a text");
    if (typeof textBody !== "string") reject("textBody is not a text");

    resolve();
  });
};

module.exports = blogDataValidate;
