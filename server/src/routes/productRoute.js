const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const router = require("express").Router();
router.route("/product").post(isAuthenticated, isAdmin, createProduct);
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/product/:id/related").get(getRelatedProducts);
router.route("/product/:id").patch(isAuthenticated, isAdmin, updateProduct);
router.route("/product/:id").delete(isAuthenticated, isAdmin, deleteProduct);
module.exports = router;
