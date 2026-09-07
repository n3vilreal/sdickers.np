const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = { ...user, _id: user.id };
    }
  } catch (error) {
  }
  next();
};
module.exports = optionalAuth;
