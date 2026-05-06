const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message =
    error instanceof ApiError ? error.message : "Something went wrong";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(error.details ? { details: error.details } : {}),
  });
};

module.exports = errorHandler;
