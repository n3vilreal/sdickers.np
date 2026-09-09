const {
  getAllReviews,
  createReview,
  getReviewStats,
} = require("../controller/review/reviewController");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = require("express").Router();
router.route("/reviews").get(getAllReviews);
router.route("/reviews").post(isAuthenticated, createReview);
router.route("/reviews/stats").get(getReviewStats);
module.exports = router;
