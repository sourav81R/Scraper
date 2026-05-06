const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const runScraper = async () => {
  const response = await axios.get("https://news.ycombinator.com");
  const $ = cheerio.load(response.data);
  const storyRows = $(".athing").slice(0, 10);

  const savedStories = await Promise.all(
    storyRows
      .map((_, element) => {
        const row = $(element);
        const titleLink = row.find(".titleline > a");
        const subtext = row.next().find(".subtext");
        const pointsText = subtext.find(".score").text();
        const parsedPoints = Number.parseInt(pointsText, 10);

        const storyData = {
          title: titleLink.text().trim(),
          url: titleLink.attr("href") || "",
          hnId: row.attr("id"),
          points: Number.isNaN(parsedPoints) ? 0 : parsedPoints,
          author: subtext.find(".hnuser").text().trim(),
          postedAt:
            subtext.find(".age").attr("title") ||
            subtext.find(".age").text().trim(),
        };

        if (!storyData.hnId || !storyData.title) {
          return null;
        }

        return Story.findOneAndUpdate(
          { hnId: storyData.hnId },
          storyData,
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      })
      .get()
  );

  return savedStories.filter(Boolean);
};

module.exports = runScraper;
