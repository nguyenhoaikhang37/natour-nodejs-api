const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        review: { type: String, required: true },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: "user",
    //     select: "-role",
    // }).populate({
    //     path: "tour",
    //     select: "name",
    // });
    this.populate({
        path: "user",
        select: "-role",
    });
    next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
