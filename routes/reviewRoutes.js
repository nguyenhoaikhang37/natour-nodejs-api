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

router.use(protect);

// GET ALL REVIEWS /reviews
// GET 1 REVIEW BY TOUR ID /tours/:tourId/reviews
router.get("/", getAllReviews);
// POST /tours/:tourId/reviews
router.post("/", restrictTo(["user"]), setTourUserIds, createReview);
router.delete("/:id", restrictTo(["user", "admin"]), deleteReview);
router.patch("/:id", restrictTo(["user", "admin"]), updateReview);

module.exports = router;
