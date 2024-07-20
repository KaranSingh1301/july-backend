const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.status(401).json("Session expired, please login again.");
  }
};

module.exports = isAuth;
