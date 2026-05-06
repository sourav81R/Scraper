const runScraper = require("../services/scraper");

const triggerScrape = async (req, res, next) => {
  try {
    const stories = await runScraper();

    return res.status(200).json({
      success: true,
      message: `Scraped ${stories.length} stories`,
      count: stories.length,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { triggerScrape };
