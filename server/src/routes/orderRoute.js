const router = require("express").Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  trackOrder,
} = require("../controller/order/orderController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const optionalAuth = require("../middleware/optionalAuth");
router.post("/order", optionalAuth, createOrder);
router.post("/order/track", isAuthenticated, trackOrder);
router.get("/myorders", isAuthenticated, getMyOrders);
router.get("/orders", isAuthenticated, isAdmin, getAllOrders);
router.get("/order/:id", isAuthenticated, isAdmin, getSingleOrder);
router.patch("/order/:id/status", isAuthenticated, isAdmin, updateOrderStatus);
router.delete("/order/:id", isAuthenticated, isAdmin, deleteOrder);
module.exports = router;
