const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user exists in the database
      const googleId = profile.id;
      const email = profile.emails[0].value;

      const queryCheckUser = "SELECT * FROM users WHERE google_id = ?";
      await db(queryCheckUser, [googleId], async (err, results) => {
        if (err) return done(err, false);

        if (results.length > 0) {
          // User exists
          return done(null, results[0]);
        } else {
          // Create a new user
          const queryInsertUser =
            "INSERT INTO users (google_id, email) VALUES (?, ?)";
          await db(queryInsertUser, [googleId, email], (err, results) => {
            if (err) return done(err, false);

            const newUser = {
              id: results.insertId,
              google_id: googleId,
              email,
            };
            return done(null, newUser);
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const query = "SELECT * FROM users WHERE id = ?";
  await db(query, [id], (err, results) => {
    if (err) return done(err, null);
    done(null, results[0]);
  });
});

module.exports = passport;
