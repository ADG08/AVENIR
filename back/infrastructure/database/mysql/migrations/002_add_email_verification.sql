-- Migration: Add email verification fields to users table
-- Date: 2025-12-22
-- This migration adds email verification functionality to the users table

-- Add verification_token column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'verification_token');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) AFTER state', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verified_at column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'verified_at');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE users ADD COLUMN verified_at TIMESTAMP NULL AFTER verification_token', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index on verification_token for faster lookups
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND INDEX_NAME = 'idx_users_verification_token');
SET @sql = IF(@index_exists = 0, 
  'CREATE INDEX idx_users_verification_token ON users(verification_token)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing users to be verified (retroactive)
UPDATE users SET verified_at = created_at WHERE verified_at IS NULL AND state = 'ACTIVE';
