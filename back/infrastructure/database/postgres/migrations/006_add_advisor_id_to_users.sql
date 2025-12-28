-- Migration: Add advisor_id column to users table
-- Date: 2025-12-28
-- Description: Adds advisor_id foreign key to link clients with their assigned advisors

-- Add advisor_id column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS advisor_id VARCHAR(255);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'users_advisor_id_fkey'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_advisor_id_fkey
        FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_advisor_id ON users(advisor_id);
