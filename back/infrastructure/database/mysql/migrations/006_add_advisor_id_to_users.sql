-- Migration: Add advisor_id column to users table (MySQL)
-- Description: Adds advisor_id foreign key to link clients with their assigned advisors

-- Add advisor_id column if it doesn't exist
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.columns
WHERE table_schema = DATABASE()
AND table_name = 'users'
AND column_name = 'advisor_id';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN advisor_id VARCHAR(255) NULL AFTER state',
    'SELECT "Column advisor_id already exists" AS message');

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint if it doesn't exist
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists
FROM information_schema.table_constraints
WHERE table_schema = DATABASE()
AND table_name = 'users'
AND constraint_name = 'fk_users_advisor';

SET @query = IF(@fk_exists = 0,
    'ALTER TABLE users ADD CONSTRAINT fk_users_advisor FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE SET NULL',
    'SELECT "Foreign key fk_users_advisor already exists" AS message');

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_advisor_id ON users(advisor_id);
