const mongoose = require("mongoose");

const scrapeRunSchema = new mongoose.Schema(
  {
    trigger: {
      type: String,
      enum: ["startup", "manual", "cron"],
      default: "manual",
      index: true,
    },
    status: {
      type: String,
      enum: ["running", "success", "failed"],
      default: "running",
      index: true,
    },
    itemsProcessed: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    error: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScrapeRun", scrapeRunSchema);
