const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    getUser,
    getMe,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
} = require("../controllers/userController");

const {
    signup,
    login,
    protect,
    updatePassword,
    restrictTo,
} = require("../controllers/authController");

router.route("/signup").post(signup);
router.route("/login").post(login);

// Protect all routes after this middleware
router.use(protect);

router.route("/me").get(getMe, getUser);
router.route("/updatePassword").post(updatePassword);
router.route("/updateMe").patch(updateMe);
router.route("/deleteMe").delete(deleteMe);

router.use(restrictTo(["admin"]));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
