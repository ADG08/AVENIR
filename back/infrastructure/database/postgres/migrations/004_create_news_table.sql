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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key to users table
    CONSTRAINT fk_news_author
        FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_author_id ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Add check constraints for validation
ALTER TABLE news ADD CONSTRAINT news_title_check
    CHECK (CHAR_LENGTH(title) >= 5 AND CHAR_LENGTH(title) <= 200);

ALTER TABLE news ADD CONSTRAINT news_description_check
    CHECK (CHAR_LENGTH(description) >= 20 AND CHAR_LENGTH(description) <= 5000);

-- Add trigger to automatically update updated_at column
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add table and column comments
COMMENT ON TABLE news IS 'Table storing news/announcements created by advisors';
COMMENT ON COLUMN news.id IS 'Unique identifier for the news';
COMMENT ON COLUMN news.title IS 'Title of the news (5-200 characters)';
COMMENT ON COLUMN news.description IS 'Full description of the news (20-5000 characters)';
COMMENT ON COLUMN news.author_id IS 'User ID of the advisor who created the news';
COMMENT ON COLUMN news.author_name IS 'Full name of the advisor at the time of creation';
COMMENT ON COLUMN news.created_at IS 'Timestamp when the news was created';
COMMENT ON COLUMN news.updated_at IS 'Timestamp when the news was last updated';
