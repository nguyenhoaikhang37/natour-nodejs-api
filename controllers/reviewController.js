const Review = require("../models/reviewModel");

const getAllReviews = async (req, res) => {
    try {
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const reviews = await Review.find(filter);
        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};

const createReview = async (req, res) => {
    try {
        if (!req.body.user) req.body.user = req.user._id;
        if (!req.body.tour) req.body.tour = req.params.tourId;

        const review = await Review.create(req.body);
        res.status(201).json({
            success: true,
            data: review,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};

module.exports = { getAllReviews, createReview };
