-- Migration: Add email verification fields to users table
-- Date: 2025-12-22
-- This migration adds email verification functionality to the users table

-- Add verification_token column
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);

-- Add verified_at column
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Add index on verification_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- Update existing users to be verified (retroactive)
UPDATE users SET verified_at = created_at WHERE verified_at IS NULL AND state = 'ACTIVE';

-- Add column comments
COMMENT ON COLUMN users.verification_token IS 'Token used for email verification';
COMMENT ON COLUMN users.verified_at IS 'Timestamp when the email was verified';
