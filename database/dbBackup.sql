-- Users Table (for Authentication using Google Sign-In)
DROP DATABASE IF EXISTS urldb;
CREATE DATABASE urldb;
USE urldb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,  -- Google ID from the OAuth authentication
    username VARCHAR(255) NULL,  -- Optional, user-provided username
    email VARCHAR(255) UNIQUE NOT NULL,  -- Email associated with Google account
    profile_picture VARCHAR(255) NULL,  -- Optional, URL to user's profile picture from Google
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- URL Shortener Table
CREATE TABLE urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    short_url VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id INT NOT NULL,  -- Reference to the user who created the short URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- URL Analytics Table (to track visits)
CREATE TABLE url_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    short_url VARCHAR(10),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (short_url) REFERENCES urls(short_url) ON DELETE CASCADE
);

-- Session Table (for tracking user sessions with Google OAuth tokens)
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- Reference to the user
    google_token VARCHAR(255) UNIQUE NOT NULL,  -- The token received from Google OAuth
    refresh_token VARCHAR(255) NULL,  -- Optional, used to refresh Google tokens
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,  -- Expiration time of the access token
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Password Reset Table (for handling password reset requests, if applicable)
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
