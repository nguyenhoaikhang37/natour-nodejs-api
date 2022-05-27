const { protect, restrictTo } = require("../controllers/authController");
const { getAllReviews, createReview } = require("../controllers/reviewController");

const router = require("express").Router({ mergeParams: true });

// GET ALL REVIEWS /reviews
// GET 1 REVIEW BY TOUR ID /tours/:tourId/reviews
router.get("/", protect, getAllReviews);
// POST /tours/:tourId/reviews
router.post("/", protect, restrictTo(["user"]), createReview);

module.exports = router;
