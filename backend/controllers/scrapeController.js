const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getLatestScrapeStatus, runScraper } = require("../services/scraper");

const triggerScrape = asyncHandler(async (req, res) => {
  const result = await runScraper({ trigger: "manual" });

  return sendSuccess(res, {
    message: `Scraped ${result.meta.count} stories successfully`,
    data: result.stories,
    meta: result.meta,
  });
});

const getScrapeStatus = asyncHandler(async (req, res) => {
  const latestRun = await getLatestScrapeStatus();

  return sendSuccess(res, {
    message: "Scrape status loaded successfully",
    data: latestRun,
  });
});

module.exports = { getScrapeStatus, triggerScrape };
