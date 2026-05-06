const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const storyRoutes = require("./routes/storyRoutes");
const scrapeRoutes = require("./routes/scrapeRoutes");
const runScraper = require("./services/scraper");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://scraper-hn.vercel.app",
];
const allowedOrigins = (
  process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : defaultOrigins
)
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api", scrapeRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await runScraper();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
