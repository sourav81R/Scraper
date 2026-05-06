const Story = require("../models/Story");
const User = require("../models/User");

const getAllStories = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Story.countDocuments();

    return res.status(200).json({
      success: true,
      data: stories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return next(error);
  }
};

const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    return res.status(200).json({ success: true, data: story });
  } catch (error) {
    return next(error);
  }
};

const toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const story = await Story.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    const alreadyBookmarked = user.bookmarks.some(
      (bookmarkId) => bookmarkId.toString() === req.params.id
    );

    if (alreadyBookmarked) {
      user.bookmarks.pull(req.params.id);
    } else {
      user.bookmarks.addToSet(req.params.id);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
      data: user.bookmarks.map((bookmarkId) => bookmarkId.toString()),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllStories, getStoryById, toggleBookmark };
