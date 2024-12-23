const rateLimit = require("express-rate-limit");

// Custom key generator for user-based rate limiting
const userBasedRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per window
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise fallback to IP address
    return req.user ? req.user.id : req.ip;
  },
  headers: true, // Include rate limit headers in the response
});

module.exports = userBasedRateLimiter;
