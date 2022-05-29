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

module.exports = {
    deleteOne,
};
