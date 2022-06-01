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

const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, ["reviews", "guides"]);
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

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
