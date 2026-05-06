const mongoose = require("mongoose");
const { env } = require("./env");
const logger = require("../utils/logger");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
      });

      logger.info("MongoDB connected successfully");
      return mongoose.connection;
    } catch (error) {
      logger.error(
        `MongoDB connection failed (attempt ${attempt}/${maxRetries})`,
        error
      );

      if (attempt === maxRetries) {
        throw error;
      }

      await wait(3000);
    }
  }

  return null;
};

module.exports = connectDB;
