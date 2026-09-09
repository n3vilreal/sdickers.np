const router = require("express").Router();
const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controller/cart/cartController");
const isAuthenticated = require("../middleware/isAuthenticated");
router.post("/cart/add", isAuthenticated, addToCart);
router.get("/cart", isAuthenticated, getCart);
router.patch("/cart/update/:productId", isAuthenticated, updateCart);
router.patch("/cart/update/pack/:packId", isAuthenticated, updateCart);
router.delete("/cart/remove/:productId", isAuthenticated, removeFromCart);
router.delete("/cart/remove/pack/:packId", isAuthenticated, removeFromCart);
router.delete("/cart/clear", isAuthenticated, clearCart);
module.exports = router;
