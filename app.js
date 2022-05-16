const express = require("express");

const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1) MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.static(`${__dirname}/public`));
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
  // res.status(404).json({
  //   success: false,
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // C2
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.statusCode = 404;

  next(err);
});

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
