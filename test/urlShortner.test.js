const request = require("supertest");
const app = require("../app"); // Your Express app
const { expect } = require("chai");
import { expect } from "chai";
const mysql = require("mysql2");
const { sequelize, User, Url, UrlAnalytics, Session } = require("../models"); // Sequelize models if you're using Sequelize

let authToken;
let userId;
let shortUrl;

// Test setup: Setup the database before testing
before(async () => {
  // Assuming you're using an in-memory or test database for this purpose
  await sequelize.sync({ force: true });
});

// Test teardown: Cleanup after tests
after(async () => {
  await sequelize.close();
});

describe("URL Shortener API Tests", () => {
  // Test for User Authentication (Google Sign-In)
  describe("POST /api/auth/google", () => {
    it("should authenticate a user with Google and return a token", async () => {
      const googleResponse = {
        googleId: "google123456",
        email: "user@example.com",
        profilePicture: "http://example.com/profile.jpg",
      };

      // Mocking the Google authentication flow
      const res = await request(app)
        .post("/api/auth/google")
        .send(googleResponse);

      expect(res.status).to.equal(200);
      expect(res.body.token).to.exist;
      authToken = res.body.token; // Store the auth token for use in other tests
    });
  });

  // Test for URL shortening
  describe("POST /api/url/shorten", () => {
    it("should shorten a URL successfully", async () => {
      const newUrl = {
        longUrl: "https://www.example.com/very-long-url-to-be-shortened",
        customAlias: "short1", // Optional custom alias
        topic: "acquisition",
      };

      const res = await request(app)
        .post("/api/url/shorten")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newUrl);

      expect(res.status).to.equal(201);
      expect(res.body.shortUrl).to.exist;
      expect(res.body.shortUrl).to.equal("short1"); // Should match the custom alias
      expect(res.body.createdAt).to.exist;
      shortUrl = res.body.shortUrl; // Save the short URL for later tests
    });
  });

  // Test for URL redirection
  describe("GET /api/url//shorten/:alias", () => {
    it("should redirect to the original URL", async () => {
      const res = await request(app).get(`/api/url/shorten/${shortUrl}`);

      expect(res.status).to.equal(302); // Should redirect
      expect(res.header.location).to.equal(
        "https://www.example.com/very-long-url-to-be-shortened"
      );
    });
  });

  // Test for URL Analytics (for a specific URL)
  describe("GET /api/url/analytics/:alias", () => {
    it("should return analytics data for the short URL", async () => {
      const res = await request(app)
        .get(`/api/url/analytics/${shortUrl}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.totalClicks).to.be.a("number");
      expect(res.body.uniqueClicks).to.be.a("number");
      expect(res.body.clicksByDate).to.be.an("array");
      expect(res.body.osType).to.be.an("array");
      expect(res.body.deviceType).to.be.an("array");
    });
  });

  // Test for Topic-Based Analytics
  describe("GET /api/url/analytics/topic/:topic", () => {
    it("should return analytics for a specific topic", async () => {
      const res = await request(app)
        .get("/api/url/analytics/topic/acquisition")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.totalClicks).to.be.a("number");
      expect(res.body.uniqueClicks).to.be.a("number");
      expect(res.body.clicksByDate).to.be.an("array");
      expect(res.body.urls).to.be.an("array");
    });
  });

  // Test for Overall Analytics (all URLs created by user)
  describe("GET /api/url/analytics/overall", () => {
    it("should return overall analytics for the user", async () => {
      const res = await request(app)
        .get("/api/url/analytics/overall")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.totalUrls).to.be.a("number");
      expect(res.body.totalClicks).to.be.a("number");
      expect(res.body.uniqueClicks).to.be.a("number");
      expect(res.body.clicksByDate).to.be.an("array");
      expect(res.body.osType).to.be.an("array");
      expect(res.body.deviceType).to.be.an("array");
    });
  });

  // Test for Rate Limiting (Prevent too many short URL requests)
  describe("POST /api/url/shorten with rate limit", () => {
    it("should return 429 when rate limit is exceeded", async () => {
      const newUrl = {
        longUrl: "https://www.example.com/another-long-url-to-be-shortened",
      };

      // Hit the endpoint multiple times to exceed rate limit
      for (let i = 0; i < 6; i++) {
        const res = await request(app)
          .post("/api/url/shorten")
          .set("Authorization", `Bearer ${authToken}`)
          .send(newUrl);

        if (i < 5) {
          expect(res.status).to.equal(201); // Should succeed
        } else {
          expect(res.status).to.equal(429); // Should return rate limit exceeded
        }
      }
    });
  });
});
