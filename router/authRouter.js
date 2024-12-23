const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google login
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123456789"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: req.user.id, email: req.user.email },
    });
  }
);

module.exports = router;
