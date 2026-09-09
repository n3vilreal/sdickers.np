const Review = require("../../model/reviewModel");

const shapeReview = (r) => ({
  _id: r.id,
  id: r.id,
  stars: r.stars,
  reviewText: r.review_text,
  userName: r.user_name,
  userId: r.user_id,
  createdAt: r.created_at,
});

exports.getAllReviews = async (req, res) => {
  try {
    const rows = await Review.all();
    res
      .status(200)
      .json({ message: "Reviews fetched successfully", total: rows.length, data: rows.map(shapeReview) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { stars, reviewText } = req.body;
    if (!stars || !reviewText || !reviewText.trim()) {
      return res.status(400).json({ message: "Please provide a star rating and a review" });
    }
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }
    const [row] = await Review.create({
      user_id: req.user.id,
      stars,
      review_text: reviewText.trim(),
    });
    res.status(201).json({
      message: "Review submitted successfully",
      data: {
        _id: row.id,
        id: row.id,
        stars: row.stars,
        reviewText: row.review_text,
        userName: req.user.user_name,
        userId: req.user.id,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.averageStars();
    res.status(200).json({
      data: {
        averageRating: Math.round(stats.average * 10) / 10,
        totalReviews: stats.total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
