const pool = require("../configs/db");

// Insert a new short URL
exports.createShortUrl = async (shortUrl, originalUrl) => {
  const [result] = await pool(
    "INSERT INTO urls (short_url, original_url) VALUES (?, ?)",
    [shortUrl, originalUrl]
  );
  return result.insertId;
};

// Find original URL by short URL
exports.getOriginalUrl = async (shortUrl) => {
  const [rows] = await pool(
    "SELECT original_url FROM urls WHERE short_url = ?",
    [shortUrl]
  );
  return rows[0];
};

// Log analytics for a visit
exports.logVisit = async (shortUrl, ipAddress, userAgent) => {
  await pool(
    "INSERT INTO url_analytics (short_url, ip_address, user_agent) VALUES (?, ?, ?)",
    [shortUrl, ipAddress, userAgent]
  );
};

// Get analytics for a specific short URL
exports.getAnalytics = async (shortUrl) => {
  const [rows] = await pool("SELECT * FROM url_analytics WHERE short_url = ?", [
    shortUrl,
  ]);
  return rows;
};
