const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// MIDDLEWARE: Hàm check id có phù hợp không, sau đó sẽ đẩy qua tourRoutes để gọi
// const checkId = (req, res, next, val) => {
//   const id = Number.parseInt(req.params.id);
//   const isValidId = tours.findIndex((el) => el.id === id) !== -1;

//   if (!isValidId) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// MIDDLEWARE:Hàm check user có nhập đủ nd hay chưa trước khi Create hoặc Update
// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

const get5Tours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    next();
};

const getAllTours = async (req, res) => {
    try {
        const totalResults = await Tour.find();
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        if (req.query.page) {
            res.status(200).json({
                status: "success",
                results: tours.length,
                data: {
                    tours,
                },
                pagination: {
                    page: req.query.page * 1,
                    total_results: totalResults.length,
                },
            });

            return;
        }

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};
const getTour = async (req, res) => {
    try {
        // const tour = await Tour.findById(req.params.id);
        const tour = await Tour.findById(req.params.id)
            .populate({
                path: "guides",
                select: "-__v",
            })
            .populate("reviews");

        res.status(200).json({
            success: true,
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            data: {
                message: error,
            },
        });
    }
};
const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            data: {
                message: error,
            },
        });
    }
};
const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            data: {
                message: error,
            },
        });
    }
};

const deleteTour = factory.deleteOne(Tour);
// const deleteTour = async (req, res) => {
//     try {
//         await Tour.deleteOne({ _id: req.params.id });

//         res.status(200).json({
//             status: "success",
//             data: {
//                 message: "Delete successfully!",
//             },
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             data: {
//                 message: error,
//             },
//         });
//     }
// };

const getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ]);

        res.status(200).json({
            status: "success",
            data: {
                stats,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

module.exports = {
    getTourStats,
    getAllTours,
    get5Tours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    // checkId,
    // checkBody,
};
