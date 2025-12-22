-- Migration: Add email verification fields to users table
-- Date: 2025-12-22

-- Add verification_token column
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) AFTER state;

-- Add verified_at column
ALTER TABLE users ADD COLUMN verified_at TIMESTAMP NULL AFTER verification_token;

-- Add index on verification_token for faster lookups
CREATE INDEX idx_users_verification_token ON users(verification_token);

-- Update existing users to be verified (retroactive)
UPDATE users SET verified_at = created_at WHERE verified_at IS NULL AND state = 'ACTIVE';
