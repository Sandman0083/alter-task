const express = require("express");
const urlController = require("../controllers/urlControllers");
const userBasedRateLimiter = require("../middlewares/rateLimiter");
const authController = require("../middlewares/authController");
const router = express.Router();
router.use(express.json());

// Auth Controller
router.use(authController.protectorController);

// Rate Limiter
router.use(userBasedRateLimiter);

/**
 * @swagger
 * /url/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags:
 *       - URL Shortener
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: "https://example.com"
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "http://localhost:3000/abc123"
 */
router.post("/shorten", urlController.createShortUrl);

/**
 * @swagger
 * /url/{shortUrl}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL identifier
 *     responses:
 *       302:
 *         description: Redirect to the original URL
 *       404:
 *         description: Short URL not found
 */
router.get("/:shortUrl", urlController.redirectShortUrl);

/**
 * @swagger
 * /url/{shortUrl}/analytics:
 *   get:
 *     summary: Get analytics for a short URL
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL identifier
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 42
 *                 lastAccessed:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-23T12:34:56.000Z"
 *       404:
 *         description: Short URL not found
 */
router.get("/:shortUrl/analytics", urlController.getAnalytics);

module.exports = router;
