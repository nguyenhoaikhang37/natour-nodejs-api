const express = require("express");

const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1) GLOBAL MIDDLEWARE

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from SAME IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(cors());

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Data sanitization against NoSQL query injection
// Trong Mongodb, nếu truy vấn {email: {"$gt": ""}} sẽ luôn trả về tất cả giá trị
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ?sort=price&sort=-price sẽ bị lỗi, nếu thêm middleware này sẽ lấy cái sort sau cùng
app.use(hpp());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTE HANDLE (trong folder controller)

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // C1
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });

  // * C2 sử dụng chung với middleware bắt lỗi bên dưới
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;

  // next(err);
});

// * middleware bắt lỗi
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.success = err.success || false;

//   res.status(err.statusCode).json({
//     message: err.message,
//     success: err.success,
//   });
// });

// 4) START SERVER
module.exports = app;
