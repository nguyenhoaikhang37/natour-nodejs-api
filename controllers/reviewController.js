const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

const setTourUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user._id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
};

const getAllReviews = factory.getAll(Review);
const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = { getAllReviews, createReview, deleteReview, updateReview, setTourUserIds };
