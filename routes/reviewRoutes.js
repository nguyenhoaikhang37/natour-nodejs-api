const { protect, restrictTo } = require("../controllers/authController");
const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
} = require("../controllers/reviewController");

// NOTE: mergeParams để gộp 2 route thành 1
const router = require("express").Router({ mergeParams: true });

// GET ALL REVIEWS /reviews
// GET 1 REVIEW BY TOUR ID /tours/:tourId/reviews
router.get("/", protect, getAllReviews);
// POST /tours/:tourId/reviews
router.post("/", protect, restrictTo(["user"]), setTourUserIds, createReview);
router.delete("/:id", protect, restrictTo(["user"]), deleteReview);
router.patch("/:id", protect, updateReview);

module.exports = router;
