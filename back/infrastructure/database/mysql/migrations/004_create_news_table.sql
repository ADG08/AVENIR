-- Migration: Create news table
-- Date: 2025-12-26
-- This migration creates the news table for storing announcements created by advisors

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key to users table
    CONSTRAINT fk_news_author
        FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index on author_id for faster lookups
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
  AND INDEX_NAME = 'idx_news_author_id');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_news_author_id ON news(author_id)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index on created_at for faster lookups (descending order)
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
  AND INDEX_NAME = 'idx_news_created_at');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_news_created_at ON news(created_at DESC)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add check constraint for title length
SET @check_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
  AND CONSTRAINT_NAME = 'news_title_check');
SET @sql = IF(@check_exists = 0,
  'ALTER TABLE news ADD CONSTRAINT news_title_check CHECK (CHAR_LENGTH(title) >= 5 AND CHAR_LENGTH(title) <= 200)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add check constraint for description length
SET @check_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
  AND CONSTRAINT_NAME = 'news_description_check');
SET @sql = IF(@check_exists = 0,
  'ALTER TABLE news ADD CONSTRAINT news_description_check CHECK (CHAR_LENGTH(description) >= 20 AND CHAR_LENGTH(description) <= 5000)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
