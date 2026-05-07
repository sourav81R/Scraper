const express = require("express");
const {
  getAllStories,
  getBookmarkedStories,
  getHomeDashboard,
  getStoryById,
  getStoryStats,
  toggleBookmark,
} = require("../controllers/storyController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  storyIdParamsSchema,
  storyQuerySchema,
} = require("../validators/storyValidator");

const router = express.Router();

router.get("/home", getHomeDashboard);
router.get("/stats/overview", getStoryStats);
router.get("/bookmarks", protect, getBookmarkedStories);
router.get("/", validateRequest(storyQuerySchema), getAllStories);
router.get("/:id", validateRequest(storyIdParamsSchema), getStoryById);
router.post(
  "/:id/bookmark",
  protect,
  validateRequest(storyIdParamsSchema),
  toggleBookmark
);

module.exports = router;
