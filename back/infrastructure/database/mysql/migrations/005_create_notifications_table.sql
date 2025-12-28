-- Migration: Create notifications table
-- Date: 2025-12-27
-- This migration creates the notifications table for storing user notifications

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    advisor_name VARCHAR(255),
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    news_id VARCHAR(255) NULL,

    -- Foreign key to users table
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    -- Foreign key to news table (optional)
    CONSTRAINT fk_notifications_news
        FOREIGN KEY (news_id) REFERENCES news(id)
        ON DELETE SET NULL,

    -- Check constraint for notification type
    CONSTRAINT notifications_type_check
        CHECK (type IN ('loan', 'success', 'warning', 'info'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index on user_id for faster lookups
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'notifications'
  AND INDEX_NAME = 'idx_notifications_user_id');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_notifications_user_id ON notifications(user_id)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index on created_at for faster lookups (descending order)
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'notifications'
  AND INDEX_NAME = 'idx_notifications_created_at');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index on read status for faster filtering
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'notifications'
  AND INDEX_NAME = 'idx_notifications_read');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_notifications_read ON notifications(`read`)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index on news_id for faster lookups
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'notifications'
  AND INDEX_NAME = 'idx_notifications_news_id');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_notifications_news_id ON notifications(news_id)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

