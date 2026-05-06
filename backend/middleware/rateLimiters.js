const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const isGoogleAuthRoute = (req) =>
  req.path === "/api/auth/google" || req.path === "/api/auth/google/status";

const shouldSkipLimiter = (customSkip) => (req, res) => {
  if (env.NODE_ENV === "development") {
    return true;
  }

  return customSkip ? customSkip(req, res) : false;
};

const buildLimiter = ({
  max,
  message,
  skip,
  skipSuccessfulRequests = false,
}) =>
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max,
    skip: shouldSkipLimiter(skip),
    skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

const globalLimiter = buildLimiter({
  max: env.RATE_LIMIT_MAX,
  message: "Too many requests. Please try again later.",
  skip: isGoogleAuthRoute,
});

const authLimiter = buildLimiter({
  max: env.AUTH_RATE_LIMIT_MAX,
  message: "Too many authentication attempts. Please slow down.",
  skipSuccessfulRequests: true,
});

const googleAuthLimiter = buildLimiter({
  max: Math.max(env.AUTH_RATE_LIMIT_MAX * 3, 60),
  message: "Too many Google sign-in attempts. Please try again shortly.",
  skipSuccessfulRequests: true,
});

module.exports = { authLimiter, globalLimiter, googleAuthLimiter };
