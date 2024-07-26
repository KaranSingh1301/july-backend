const { userDataValidation } = require("../utils/authUtils");

const registerController = async (req, res) => {
  console.log(req.body);
  const { email, username, password, name } = req.body;

  //data validation
  try {
    await userDataValidation({ email, username, password });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Data invalid",
      error: error,
    });
  }

  return res.send("register from controller is working");
};

const loginController = (req, res) => {
  console.log("login api working");
  return res.send("login from controller is working");
};

module.exports = { registerController, loginController };
