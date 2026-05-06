const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const {
  isFirebaseAuthConfigured,
  verifyFirebaseToken,
} = require("../config/firebaseAdmin");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const signToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  authProvider: user.authProvider,
  bookmarks: (user.bookmarks || []).map((bookmark) => bookmark.toString()),
  createdAt: user.createdAt,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    authProvider: "local",
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Account created successfully",
    data: {
      token: signToken(user._id),
      user: sanitizeUser(user),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.authProvider === "google" || !user.password) {
    throw new ApiError(400, "Use Continue with Google for this account");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const safeUser = await User.findById(user._id).lean();

  return sendSuccess(res, {
    message: "Logged in successfully",
    data: {
      token: signToken(user._id),
      user: sanitizeUser(safeUser),
    },
  });
});

const googleSignIn = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const decodedToken = await verifyFirebaseToken(idToken);
  const email = decodedToken.email?.toLowerCase();

  if (!email) {
    throw new ApiError(400, "Google account email is unavailable");
  }

  let user = await User.findOne({
    $or: [{ firebaseUid: decodedToken.uid }, { email }],
  });

  if (!user) {
    user = await User.create({
      name: decodedToken.name || email.split("@")[0],
      email,
      authProvider: "google",
      firebaseUid: decodedToken.uid,
      avatarUrl: decodedToken.picture || "",
    });
  } else {
    user.name = user.name || decodedToken.name || email.split("@")[0];
    user.firebaseUid = user.firebaseUid || decodedToken.uid;
    user.authProvider = "google";
    user.avatarUrl = decodedToken.picture || user.avatarUrl;
    await user.save();
  }

  return sendSuccess(res, {
    message: "Google sign-in successful",
    data: {
      token: signToken(user._id),
      user: sanitizeUser(user),
    },
  });
});

const getGoogleAuthStatus = asyncHandler(async (req, res) =>
  sendSuccess(res, {
    message: "Google auth status loaded",
    data: {
      configured: isFirebaseAuthConfigured(),
      projectId: env.FIREBASE_PROJECT_ID || null,
    },
  })
);

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sendSuccess(res, {
    message: "Profile loaded",
    data: sanitizeUser(user),
  });
});

module.exports = {
  getCurrentUser,
  getGoogleAuthStatus,
  googleSignIn,
  login,
  register,
};
