const express = require("express");
// const rateLimit = require('express-rate-limit');

const router = express.Router();

// const limiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 2,
//   message: 'DDOS là không tốt nha bạn troẻ!',
// });

const {
    getTourStats,
    getAllTours,
    get5Tours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    // checkId,
    // checkBody,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

// Nested routes
router.use("/:tourId/reviews", reviewRouter);

// Middleware để check id có đúng hay không
// router.param('id', checkId);
router
    .route("/")
    .get(getAllTours)
    .post(protect, restrictTo(["admin", "lead-guide"]), createTour);
router.route("/tour-stats").get(getTourStats);
router.route("/top-5").get(get5Tours, getAllTours);
router
    .route("/:id")
    .get(getTour)
    .patch(protect, restrictTo(["admin", "lead-guide"]), updateTour)
    .delete(protect, restrictTo(["lead-guide", "admin"]), deleteTour);

module.exports = router;
