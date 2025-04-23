// Operational Errors
// Custom error class to throw errors
class AppError extends Error {
  // Extends built-in parent class Error
  constructor(message, statusCode) {
    super(message); // calls the parent contructor (in this case, Error)

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
