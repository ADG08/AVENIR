-- Migration: Replace saving_rate_id with saving_type
-- Removes saving_rate_id foreign key and adds saving_type column

-- Drop foreign key constraint if it exists
ALTER TABLE accounts
    DROP CONSTRAINT IF EXISTS fk_accounts_saving_rate;

-- Drop saving_rate_id column
ALTER TABLE accounts
    DROP COLUMN IF EXISTS saving_rate_id;

-- Add saving_type column
ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS saving_type VARCHAR(50);

COMMENT ON COLUMN accounts.saving_type IS 'Type of savings account (Livret A, Livret Jeune, PEA, PEL). NULL for CURRENT accounts.';

