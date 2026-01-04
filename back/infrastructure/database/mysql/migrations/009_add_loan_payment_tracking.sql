-- Migration: Add loan payment tracking fields
-- This migration adds fields to track loan delivery and next payment date

-- Add delivered_at column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'loans'
  AND COLUMN_NAME = 'delivered_at');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE loans ADD COLUMN delivered_at TIMESTAMP NULL',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add next_payment_date column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'loans'
  AND COLUMN_NAME = 'next_payment_date');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE loans ADD COLUMN next_payment_date TIMESTAMP NULL',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for next_payment_date to optimize cron queries
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'loans'
  AND INDEX_NAME = 'idx_loans_next_payment_date');
SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_loans_next_payment_date ON loans(next_payment_date, status)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
