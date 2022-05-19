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
const { protect } = require("../controllers/authController");

// Middleware để check id có đúng hay không
// router.param('id', checkId);
router.route("/tour-stats").get(getTourStats);
router.route("/").get(protect, getAllTours).post(createTour);
router.route("/top-5").get(get5Tours, getAllTours);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
