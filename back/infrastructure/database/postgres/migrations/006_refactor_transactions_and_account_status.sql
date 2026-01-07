-- Migration: Refactor transactions table and add account status
-- Adds from_account_id/to_account_id to transactions and status to accounts
-- Accounts are never deleted (only marked INACTIVE), preserving transaction history

-- Update transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS from_account_id VARCHAR(255) REFERENCES accounts(id) ON DELETE CASCADE;

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS to_account_id VARCHAR(255) REFERENCES accounts(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_transactions_from_account_id ON transactions(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_account_id ON transactions(to_account_id);

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_account_id_fkey;
DROP INDEX IF EXISTS idx_transactions_account_id;
ALTER TABLE transactions DROP COLUMN IF EXISTS account_id;

-- Add status to accounts table
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';

ALTER TABLE accounts 
ADD CONSTRAINT accounts_status_check CHECK (status IN ('ACTIVE', 'INACTIVE'));

UPDATE accounts SET status = 'ACTIVE' WHERE status IS NULL;
ALTER TABLE accounts ALTER COLUMN status SET NOT NULL;
ALTER TABLE accounts ALTER COLUMN status SET DEFAULT 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
