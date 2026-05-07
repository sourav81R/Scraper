const ScrapeRun = require("../models/ScrapeRun");
const Story = require("../models/Story");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination } = require("../utils/pagination");

const buildStoryQuery = ({ search, domain }) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { domain: { $regex: search, $options: "i" } },
    ];
  }

  if (domain) {
    query.domain = domain;
  }

  return query;
};

const buildSort = ({ sortBy, order }) => {
  const direction = order === "asc" ? 1 : -1;

  switch (sortBy) {
    case "recent":
      return { scrapedAt: direction, points: -1 };
    case "comments":
      return { commentsCount: direction, points: -1 };
    case "title":
      return { title: direction };
    case "points":
    default:
      return { points: direction, scrapedAt: -1 };
  }
};

const buildStoryStats = async () => {
  const [totalStories, totals, domains, latestScrape, totalUsers] = await Promise.all([
    Story.countDocuments(),
    Story.aggregate([
      {
        $group: {
          _id: null,
          avgPoints: { $avg: "$points" },
          avgComments: { $avg: "$commentsCount" },
          maxPoints: { $max: "$points" },
        },
      },
    ]),
    Story.distinct("domain"),
    ScrapeRun.findOne({ status: "success" }).sort({ finishedAt: -1 }).lean(),
    User.countDocuments(),
  ]);

  const bookmarkAggregation = await User.aggregate([
    {
      $project: {
        bookmarkCount: { $size: "$bookmarks" },
      },
    },
    {
      $group: {
        _id: null,
        totalBookmarks: { $sum: "$bookmarkCount" },
      },
    },
  ]);

  return {
    totalStories,
    totalUsers,
    totalBookmarks: bookmarkAggregation[0]?.totalBookmarks || 0,
    avgPoints: Math.round(totals[0]?.avgPoints || 0),
    avgComments: Math.round(totals[0]?.avgComments || 0),
    maxPoints: totals[0]?.maxPoints || 0,
    uniqueDomains: domains.length,
    lastScrapedAt: latestScrape?.finishedAt || latestScrape?.createdAt || null,
  };
};

const getAllStories = asyncHandler(async (req, res) => {
  const { page, limit, search, domain, sortBy, order } = req.query;
  const query = buildStoryQuery({ search, domain });
  const sort = buildSort({ sortBy, order });

  const [stories, total, latestScrape, domainOptions] = await Promise.all([
    Story.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Story.countDocuments(query),
    ScrapeRun.findOne({ status: "success" }).sort({ finishedAt: -1 }).lean(),
    Story.distinct("domain"),
  ]);

  return sendSuccess(res, {
    message: "Stories loaded successfully",
    data: stories,
    meta: {
      pagination: buildPagination({ page, limit, total }),
      filters: {
        search,
        domain,
        sortBy,
        order,
        availableDomains: domainOptions.sort((a, b) => a.localeCompare(b)),
      },
      lastScrapedAt: latestScrape?.finishedAt || null,
    },
  });
});

const getHomeDashboard = asyncHandler(async (req, res) => {
  const [stories, stats] = await Promise.all([
    Story.find()
      .sort({ points: -1, scrapedAt: -1 })
      .limit(3)
      .lean(),
    buildStoryStats(),
  ]);

  return sendSuccess(res, {
    message: "Homepage data loaded successfully",
    data: {
      stories,
      stats,
    },
  });
});

const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).lean();

  if (!story) {
    throw new ApiError(404, "Story not found");
  }

  return sendSuccess(res, {
    message: "Story loaded successfully",
    data: story,
  });
});

const getBookmarkedStories = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const stories = await Story.find({ _id: { $in: user.bookmarks } })
    .sort({ points: -1, scrapedAt: -1 })
    .lean();

  return sendSuccess(res, {
    message: "Bookmarks loaded successfully",
    data: stories,
    meta: {
      total: stories.length,
    },
  });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const [user, story] = await Promise.all([
    User.findById(req.user.id),
    Story.findById(req.params.id).lean(),
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!story) {
    throw new ApiError(404, "Story not found");
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

  return sendSuccess(res, {
    message: alreadyBookmarked
      ? "Story removed from bookmarks"
      : "Story added to bookmarks",
    data: {
      bookmarked: !alreadyBookmarked,
      bookmarks: user.bookmarks.map((bookmarkId) => bookmarkId.toString()),
    },
  });
});

const getStoryStats = asyncHandler(async (req, res) => {
  const stats = await buildStoryStats();

  return sendSuccess(res, {
    message: "Story stats loaded successfully",
    data: stats,
  });
});

module.exports = {
  getAllStories,
  getBookmarkedStories,
  getHomeDashboard,
  getStoryById,
  getStoryStats,
  toggleBookmark,
};
