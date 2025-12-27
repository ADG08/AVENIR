-- Migration: Replace saving_rate_id with saving_type
-- Removes saving_rate_id foreign key and adds saving_type column

-- Drop foreign key constraint if it exists
ALTER TABLE accounts
    DROP FOREIGN KEY IF EXISTS fk_accounts_saving_rate;

-- Drop saving_rate_id column
ALTER TABLE accounts
    DROP COLUMN IF EXISTS saving_rate_id;

-- Add saving_type column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'accounts'
  AND COLUMN_NAME = 'saving_type');

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE accounts ADD COLUMN saving_type VARCHAR(50)',
  'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

