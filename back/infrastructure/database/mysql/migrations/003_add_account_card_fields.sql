-- Migration: Add card fields and IBAN to accounts table
-- Date: 2025-12-23
-- This migration adds IBAN, card information, and saving rate linking to accounts

-- Add iban column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'iban');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN iban VARCHAR(34) UNIQUE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add name column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'name');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN name VARCHAR(255)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add card_number column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'card_number');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN card_number VARCHAR(16) UNIQUE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add card_holder_name column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'card_holder_name');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN card_holder_name VARCHAR(255)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add card_expiry_date column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'card_expiry_date');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN card_expiry_date VARCHAR(5)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add card_cvv column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'card_cvv');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN card_cvv VARCHAR(3)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add saving_rate_id column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND COLUMN_NAME = 'saving_rate_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE accounts ADD COLUMN saving_rate_id VARCHAR(255)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for saving_rate_id
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND CONSTRAINT_NAME = 'fk_accounts_saving_rate');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE accounts ADD CONSTRAINT fk_accounts_saving_rate FOREIGN KEY (saving_rate_id) REFERENCES saving_rates(id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update type check constraint (ensures CURRENT and SAVINGS are the only allowed values)
SET @check_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND CONSTRAINT_NAME = 'accounts_chk_1');
SET @sql = IF(@check_exists > 0, 
  'ALTER TABLE accounts DROP CHECK accounts_chk_1', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add accounts_type_check constraint
SET @check_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND CONSTRAINT_NAME = 'accounts_type_check');
SET @sql = IF(@check_exists = 0, 
  'ALTER TABLE accounts ADD CONSTRAINT accounts_type_check CHECK (type IN (''CURRENT'', ''SAVINGS''))', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for IBAN lookups
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'accounts' 
  AND INDEX_NAME = 'idx_accounts_iban');
SET @sql = IF(@index_exists = 0, 
  'CREATE INDEX idx_accounts_iban ON accounts(iban)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
