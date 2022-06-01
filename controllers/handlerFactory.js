const APIFeatures = require("../utils/apiFeatures");

const deleteOne = (Model) => async (req, res) => {
    try {
        await Model.deleteOne({ _id: req.params.id });

        res.status(200).json({
            status: "success",
            data: {
                message: "Delete successfully!",
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

const createOne = (Model) => async (req, res) => {
    try {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: "success",
            data: doc,
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

const updateOne = (Model) => async (req, res) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return res.status(404).json({
                success: false,
                data: {
                    message: "No document found with that ID",
                },
            });
        }

        res.status(200).json({
            status: "success",
            data: doc,
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

const getOne = (Model, popOptions) => async (req, res) => {
    try {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return res.status(404).json({
                success: false,
                data: {
                    message: "No document found with that ID",
                },
            });
        }

        res.status(200).json({
            success: true,
            data: doc,
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

const getAll = (Model) => async (req, res) => {
    try {
        // to allow for nested GET reviews on tour (hack)
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const totalResults = await Model.find(filter);
        // EXECUTE QUERY
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;

        if (req.query.page) {
            return res.status(200).json({
                status: "success",
                results: doc.length,
                data: doc,
                pagination: {
                    page: req.query.page * 1,
                    total_results: totalResults.length,
                },
            });
        }

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: doc.length,
            data: doc,
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

module.exports = {
    deleteOne,
    createOne,
    updateOne,
    getOne,
    getAll,
};
