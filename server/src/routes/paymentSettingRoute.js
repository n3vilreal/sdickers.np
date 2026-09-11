const router = require("express").Router();
const {
  getPaymentSettings,
  updatePaymentSetting,
} = require("../controller/payment/paymentSettingController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
router.get("/payment-settings", getPaymentSettings);
router.patch(
  "/payment-settings/:method",
  isAuthenticated,
  isAdmin,
  updatePaymentSetting
);
module.exports = router;
