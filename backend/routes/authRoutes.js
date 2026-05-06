const express = require("express");
const {
  register,
  login,
  googleSignIn,
  getGoogleAuthStatus,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/google/status", getGoogleAuthStatus);
router.post("/google", googleSignIn);

module.exports = router;
