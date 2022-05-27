const Review = require("../models/reviewModel");

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
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
