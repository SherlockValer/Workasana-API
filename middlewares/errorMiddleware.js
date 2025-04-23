const AppError = require("../services/appError");

// Global error Handling Middleware to catch all errors
exports.globalErrorHandler = (err, req, res, next) => {
  // Handle Mongoose Errors
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    res.status(400).json({
      status: "fail",
      message,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    res.status(400).json({
      status: "fail",
      message: messages.join(", "),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({
      status: "fail",
      message: `Duplicate value for ${field}. Please use another value.`,
    });
  }

  // Default error handling
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "internal server error";

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
