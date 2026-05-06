const express = require("express");
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
} = require("../controllers/storyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;
