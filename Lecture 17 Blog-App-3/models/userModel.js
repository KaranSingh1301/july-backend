const bcrypt = require("bcryptjs");
const userSchema = require("../schemas/userSchema");

const User = class {
  constructor({ email, name, password, username }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      //check if username and email exist or not

      const userExist = await userSchema.findOne({
        $or: [{ email: this.email }, { username: this.username }],
      });

      if (userExist && userExist.email === this.email) {
        reject("Email already exist");
      }

      if (userExist && userExist.username === this.username) {
        reject("Username already exist");
      }

      //hashed the password
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      //store the data in DB
      const user = new userSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassword,
      });
      try {
        const userDb = await user.save();

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithLoginId({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema
          .findOne({
            $or: [{ email: loginId }, { username: loginId }],
          })
          .select("+password");

        if (!userDb) reject("User not found, please register first");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;

// api ---> router ----> controller -----> model ------>DB

//
