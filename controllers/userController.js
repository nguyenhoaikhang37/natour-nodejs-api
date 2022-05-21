const { findByIdAndUpdate } = require("../models/userModel");
const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateMe = async (req, res) => {
  try {
    // 1. Loại bỏ những thông tin cần bảo mật như role: "admin"
    const filteredUser = filteredBody(req.body, "username", "email");

    // 2. Tìm user cần update và update user
    const user = await User.findByIdAndUpdate(req.user.id, filteredUser, {
      new: true,
      runValidators: true,
    });

    // 2. Trả về kq
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: handleErrorProtect(error.name),
    });
  }
};

const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(200).json({
      success: true,
      msg: "Delete me success!",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.name,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
