const express = require("express");
const {
  getCurrentUser,
  getGoogleAuthStatus,
  googleSignIn,
  login,
  register,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter, googleAuthLimiter } = require("../middleware/rateLimiters");
const validateRequest = require("../middleware/validateRequest");
const {
  googleLoginSchema,
  loginSchema,
  registerSchema,
} = require("../validators/authValidator");

const router = express.Router();

router.get("/google/status", getGoogleAuthStatus);
router.get("/me", protect, getCurrentUser);
router.post("/register", authLimiter, validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post(
  "/google",
  googleAuthLimiter,
  validateRequest(googleLoginSchema),
  googleSignIn
);

module.exports = router;
