const cron = require("node-cron");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const mongoose = require("mongoose");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { env } = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const { globalLimiter } = require("./middleware/rateLimiters");
const authRoutes = require("./routes/authRoutes");
const scrapeRoutes = require("./routes/scrapeRoutes");
const storyRoutes = require("./routes/storyRoutes");
const { getLatestScrapeStatus, runScraper } = require("./services/scraper");
const logger = require("./utils/logger");

const app = express();
let server;
let cronTask;

const allowedOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(globalLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", async (req, res) => {
  const latestScrape = await getLatestScrapeStatus();

  res.status(200).json({
    success: true,
    message: "Service is healthy",
    data: {
      status: "ok",
      environment: env.NODE_ENV,
      databaseState: mongoose.connection.readyState,
      lastScrapeStatus: latestScrape?.status || "never-run",
      lastScrapedAt: latestScrape?.finishedAt || null,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api", scrapeRoutes);
app.use(notFound);
app.use(errorHandler);

const startScheduledScraping = () => {
  cronTask = cron.schedule(env.SCRAPE_CRON, async () => {
    try {
      await runScraper({ trigger: "cron" });
    } catch (error) {
      logger.error("Scheduled scraper failed", error);
    }
  });
};

const shutdown = async (signal) => {
  try {
    if (cronTask) {
      cronTask.stop();
    }

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await mongoose.connection.close();
    logger.info(`Server shut down gracefully after ${signal}`);
    process.exit(0);
  } catch (error) {
    logger.error("Shutdown failed", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

const listenOnPort = (expressApp, port) =>
  new Promise((resolve, reject) => {
    const httpServer = http.createServer(expressApp);

    httpServer.once("error", reject);
    httpServer.listen(port, () => {
      httpServer.removeListener("error", reject);
      resolve(httpServer);
    });
  });

const startServer = async () => {
  try {
    await connectDB();
    server = await listenOnPort(app, env.PORT);
    logger.info(`Server running on port ${env.PORT}`);

    startScheduledScraping();

    runScraper({ trigger: "startup" }).catch((error) => {
      logger.error("Startup scraper failed", error);
    });
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      logger.error(
        `Port ${env.PORT} is already in use. Stop the existing process or change PORT in backend/.env.`
      );
    } else {
      logger.error("Server startup failed", error);
    }

    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

startServer();
