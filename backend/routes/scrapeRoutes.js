const express = require("express");
const {
  getScrapeStatus,
  triggerScrape,
} = require("../controllers/scrapeController");

const router = express.Router();

router.get("/scrape/status", getScrapeStatus);
router.post("/scrape", triggerScrape);

module.exports = router;
