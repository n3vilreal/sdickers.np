const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admins only. You are not allowed to perform this action.",
    });
  }
  next();
};
module.exports = isAdmin;
