const { protect, restrictTo } = require("../controllers/authController");
const { getAllReviews, createReview } = require("../controllers/reviewController");

const router = require("express").Router();

router.get("/", protect, getAllReviews);
router.post("/", protect, restrictTo(["user"]), createReview);

module.exports = router;
