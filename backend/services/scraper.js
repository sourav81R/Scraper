const axios = require("axios");
const cheerio = require("cheerio");
const ScrapeRun = require("../models/ScrapeRun");
const Story = require("../models/Story");
const logger = require("../utils/logger");

const HN_BASE_URL = "https://news.ycombinator.com";

const scraperClient = axios.create({
  baseURL: HN_BASE_URL,
  timeout: 15000,
  headers: {
    "User-Agent":
      "HN-Tracker/1.0 (+https://scraper-hn.vercel.app) recruiter-ready scraper",
  },
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractDomain = (url) => {
  if (!url) {
    return "news.ycombinator.com";
  }

  try {
    const normalizedUrl = url.startsWith("item?id=") ? `${HN_BASE_URL}/${url}` : url;
    return new URL(normalizedUrl).hostname.replace(/^www\./, "");
  } catch (error) {
    return "news.ycombinator.com";
  }
};

const parseInteger = (value) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const fetchHackerNewsHtml = async () => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await scraperClient.get("/");
      return response.data;
    } catch (error) {
      logger.warn(`Scraper request failed on attempt ${attempt}/${maxAttempts}`);

      if (attempt === maxAttempts) {
        throw error;
      }

      await wait(attempt * 1000);
    }
  }

  return "";
};

const parseStories = (html) => {
  const $ = cheerio.load(html);

  return $(".athing")
    .slice(0, 10)
    .map((index, element) => {
      const row = $(element);
      const titleLink = row.find(".titleline > a");
      const subtext = row.next().find(".subtext");
      const commentsLink = subtext
        .find('a[href^="item?id="]')
        .last()
        .text()
        .trim();
      const storyUrl = titleLink.attr("href") || "";
      const scrapedAt = new Date();

      const storyData = {
        hnId: row.attr("id"),
        title: titleLink.text().trim(),
        url: storyUrl,
        domain: extractDomain(storyUrl),
        points: parseInteger(subtext.find(".score").text()),
        commentsCount: commentsLink.includes("comment")
          ? parseInteger(commentsLink)
          : 0,
        author: subtext.find(".hnuser").text().trim(),
        postedAt:
          subtext.find(".age").attr("title") ||
          subtext.find(".age").text().trim(),
        rank: index + 1,
        scrapedAt,
        lastSeenAt: scrapedAt,
      };

      return storyData.hnId && storyData.title ? storyData : null;
    })
    .get()
    .filter(Boolean);
};

const getLatestScrapeStatus = async () =>
  ScrapeRun.findOne().sort({ createdAt: -1 }).lean();

const runScraper = async ({ trigger = "manual" } = {}) => {
  const scrapeRun = await ScrapeRun.create({
    trigger,
    status: "running",
    startedAt: new Date(),
    message: "Scrape started",
  });

  const startedAtMs = Date.now();

  try {
    logger.info(`Scraper started via ${trigger}`);
    const html = await fetchHackerNewsHtml();
    const parsedStories = parseStories(html);

    if (parsedStories.length === 0) {
      throw new Error("No stories were found during scraping");
    }

    await Story.bulkWrite(
      parsedStories.map((story) => ({
        updateOne: {
          filter: { hnId: story.hnId },
          update: { $set: story },
          upsert: true,
        },
      }))
    );

    const stories = await Story.find({
      hnId: { $in: parsedStories.map((story) => story.hnId) },
    })
      .sort({ rank: 1 })
      .lean();

    const durationMs = Date.now() - startedAtMs;

    await ScrapeRun.findByIdAndUpdate(scrapeRun._id, {
      status: "success",
      itemsProcessed: stories.length,
      finishedAt: new Date(),
      durationMs,
      message: `Scraped ${stories.length} stories successfully`,
      error: "",
    });

    logger.info(`Scraper completed with ${stories.length} stories in ${durationMs}ms`);

    return {
      stories,
      meta: {
        count: stories.length,
        durationMs,
        trigger,
      },
    };
  } catch (error) {
    const durationMs = Date.now() - startedAtMs;

    await ScrapeRun.findByIdAndUpdate(scrapeRun._id, {
      status: "failed",
      itemsProcessed: 0,
      finishedAt: new Date(),
      durationMs,
      message: "Scrape failed",
      error: error.message,
    });

    logger.error("Scraper failed", error);
    throw error;
  }
};

module.exports = { getLatestScrapeStatus, runScraper };
