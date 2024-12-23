const urlModel = require("../models/userModels");

const generateNanoId = async () => {
  const { nanoid } = await import("nanoid");
  return nanoid();
};

// Create a short URL
exports.createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required." });
  }

  try {
    const shortUrl = generateNanoId(); // Generate a 6-character unique ID
    await urlModel.createShortUrl(shortUrl, originalUrl);
    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Redirect to the original URL
exports.redirectShortUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const result = await urlModel.getOriginalUrl(shortUrl);

    if (!result) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    // Log visit
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    await urlModel.logVisit(shortUrl, ipAddress, userAgent);

    res.redirect(result.original_url);
  } catch (error) {
    console.error("Error redirecting short URL:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get analytics for a specific short URL
exports.getAnalytics = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const analytics = await urlModel.getAnalytics(shortUrl);

    if (!analytics.length) {
      return res
        .status(404)
        .json({ error: "No analytics found for this URL." });
    }

    res.status(200).json({ analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
