const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized"));
  }
};

module.exports = { protect };
