const AppError = require("../services/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((val) => val.message);
  return new AppError(messages.join(", "), 400);
};

const handleDuplicateKeyErrorDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate value for ${field}. Please use another value.`,
    400
  );
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please login in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired! Please log in again", 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details

    // 1) Log Error : For developer (on hosted platform)
    console.error("ERROR", err);

    // 2) send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Global error Handling Middleware to catch all errors
exports.globalErrorHandler = (err, req, res, next) => {
  // Default error handling
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);
    error.message = err.message; // Ensure message is copied

    // Handle Mongoose Errors
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateKeyErrorDB(error);

    // Handle JWT Errors
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
