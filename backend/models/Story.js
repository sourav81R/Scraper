const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    hnId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    domain: {
      type: String,
      default: "news.ycombinator.com",
      trim: true,
      index: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    author: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    postedAt: {
      type: String,
      default: "",
      trim: true,
    },
    rank: {
      type: Number,
      default: 0,
      min: 0,
    },
    source: {
      type: String,
      default: "hackernews",
      immutable: true,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

storySchema.index({ title: "text", author: "text", domain: "text" });
storySchema.index({ points: -1, scrapedAt: -1 });
storySchema.index({ commentsCount: -1, scrapedAt: -1 });

module.exports = mongoose.model("Story", storySchema);
