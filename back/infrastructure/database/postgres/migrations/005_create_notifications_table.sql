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
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    news_id VARCHAR(255),

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
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_news_id ON notifications(news_id);

-- Add table and column comments
COMMENT ON TABLE notifications IS 'Table storing user notifications';
COMMENT ON COLUMN notifications.id IS 'Unique identifier for the notification';
COMMENT ON COLUMN notifications.user_id IS 'ID of the user who receives the notification';
COMMENT ON COLUMN notifications.title IS 'Title of the notification';
COMMENT ON COLUMN notifications.message IS 'Message content of the notification';
COMMENT ON COLUMN notifications.type IS 'Type of notification: loan, success, warning, or info';
COMMENT ON COLUMN notifications.advisor_name IS 'Name of the advisor who sent the notification (optional)';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read';
COMMENT ON COLUMN notifications.created_at IS 'Timestamp when the notification was created';
COMMENT ON COLUMN notifications.news_id IS 'ID of the related news (optional, NULL if not related to a news)';
