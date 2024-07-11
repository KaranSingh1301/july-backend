const loginController = (req, res) => {
  console.log("login api");
  return res.send("login api workings controller");
};

const registerController = (req, res) => {
  console.log("register api");
  return res.send("register api workings controller");
};

module.exports = { loginController, registerController };
