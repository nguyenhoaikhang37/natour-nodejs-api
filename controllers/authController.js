const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

const signup = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    // Không nên sd cách dưới, bởi vì req.body thì ng dùng có thể thêm các thông tin bảo mật như admin
    // const newUser = await User.create(req.body);

    // Cách làm đúng
    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    const token = signToken(newUser._id);

    // Remove password before send response
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: newUser,
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Check email và password có nhập đầy đủ không
    if (!email || !password) {
      return res.status(222).json({
        success: false,
        message: "Email or password is required",
      });
    }
    // 2. Check xem email có tồn tại trong DB, password có trùng khớp ko
    const correctUser = await User.findOne({ email }).select("+password");
    const isMatchPassword = await correctUser.verifyPassword(password, correctUser.password);

    if (!correctUser || !isMatchPassword) {
      return res.status(400).json({
        success: false,
        message: "Email or password is not match",
      });
    }
    // 3. Nếu thoả đk, tạo token mới và trả về cho ng dùng
    const token = signToken(correctUser._id);

    res.status(201).json({
      success: true,
      token,
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

const protect = async (req, res, next) => {
  try {
    // 1. Check xem co token hay khong
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Không có token, trả về lỗi
    if (!token) {
      return res.status(401).json({
        success: false,
        data: {
          message: "Please log in to get access",
        },
      });
    }

    // 3. Verification token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("⭐️ · file: authController.js · line 101 · decoded", decoded);

    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      error,
    });
  }
};

module.exports = {
  signup,
  login,
  protect,
};
