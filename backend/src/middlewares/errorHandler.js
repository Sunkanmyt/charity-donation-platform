const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  // Multer built-in errors (e.g., LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = `Upload error: ${err.message}`;
  }

  // Custom file filter rejections (e.g., non-image files)
  if (
    err.message &&
    (err.message.includes("file type") || err.message.includes("image"))
  ) {
    statusCode = 400;
    message = err.message;
  }

  // Mongoose invalid ObjectId format
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format for: ${err.value}`;
  }

  // Mongoose schema validation failures
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    // Hide call stack from users in production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
