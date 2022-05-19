const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Tell me us your name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password confirm"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  // Check xem password có thay đổi hay không, nếu không => next
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Hàm check password bằng bcrypt
userSchema.methods.verifyPassword = (candidatePassword, password) => {
  return bcrypt.compare(candidatePassword, password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
