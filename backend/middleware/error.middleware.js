import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    user: req.decodedToken?.uid || "unauthenticated",
    status: err.status || 500
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
};
