const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );
  return isEmail;
};

const userDataValidation = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !password) reject("Missing user data");

    if (typeof email !== "string") reject("Email is not a text");
    if (typeof username !== "string") reject("username is not a text");
    if (typeof password !== "string") reject("password is not a text");

    if (username.length < 3 || username.length > 50)
      reject("Username length should be 3-50");

    if (!isEmailValidate({ key: email }))
      reject("Format of an email is incorrect");
    resolve();
  });
};

module.exports = { userDataValidation, isEmailValidate };
