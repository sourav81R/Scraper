const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  verifyFirebaseToken,
  isFirebaseAuthConfigured,
} = require("../config/firebaseAdmin");

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  authProvider: user.authProvider,
  bookmarks: (user.bookmarks || []).map((bookmark) => bookmark.toString()),
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: "local",
    });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.authProvider === "google" || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Use Continue with Google for this account",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    const safeUser = await User.findById(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: buildUserResponse(safeUser),
    });
  } catch (error) {
    return next(error);
  }
};

const googleSignIn = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, message: "Google sign-in token is required" });
    }

    const decodedToken = await verifyFirebaseToken(idToken);
    const email = decodedToken.email?.toLowerCase();

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Google account email is unavailable" });
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
      });
    } else {
      if (!user.firebaseUid) {
        user.firebaseUid = decodedToken.uid;
      }

      if (!user.name && decodedToken.name) {
        user.name = decodedToken.name;
      }

      if (user.authProvider !== "google" && !user.password) {
        user.authProvider = "google";
      }

      await user.save();
    }

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    if (error.message === "Firebase Admin credentials are not configured") {
      return res.status(500).json({
        success: false,
        message: "Google sign-in is not configured on the server.",
      });
    }

    if (error.message === "Firebase project ID is not configured") {
      return res.status(500).json({
        success: false,
        message:
          "Google sign-in is not configured on the server. Add FIREBASE_PROJECT_ID to the backend environment.",
      });
    }

    return next(error);
  }
};

const getGoogleAuthStatus = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        configured: isFirebaseAuthConfigured(),
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, googleSignIn, getGoogleAuthStatus };
