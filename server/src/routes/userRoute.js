const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/admin/user/userController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/user/:id", isAuthenticated, isAdmin, getSingleUser);
router.patch("/user/:id/role", isAuthenticated, isAdmin, updateUserRole);
router.delete("/user/:id", isAuthenticated, isAdmin, deleteUser);
module.exports = router;
