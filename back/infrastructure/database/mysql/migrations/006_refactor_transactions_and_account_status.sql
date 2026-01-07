-- Migration: Refactor transactions table and add account status
-- Adds from_account_id/to_account_id to transactions and status to accounts
-- Accounts are never deleted (only marked INACTIVE), preserving transaction history

-- Update transactions table
ALTER TABLE transactions 
ADD COLUMN from_account_id VARCHAR(255) NULL,
ADD CONSTRAINT fk_transactions_from_account 
    FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE CASCADE;

ALTER TABLE transactions 
ADD COLUMN to_account_id VARCHAR(255) NULL,
ADD CONSTRAINT fk_transactions_to_account 
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE CASCADE;

CREATE INDEX idx_transactions_from_account_id ON transactions(from_account_id);
CREATE INDEX idx_transactions_to_account_id ON transactions(to_account_id);

ALTER TABLE transactions DROP FOREIGN KEY transactions_ibfk_1;
ALTER TABLE transactions DROP INDEX idx_transactions_account_id;
ALTER TABLE transactions DROP COLUMN account_id;

-- Add status to accounts table
ALTER TABLE accounts 
ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE';

ALTER TABLE accounts 
ADD CONSTRAINT accounts_status_check CHECK (status IN ('ACTIVE', 'INACTIVE'));

UPDATE accounts SET status = 'ACTIVE' WHERE status IS NULL;
ALTER TABLE accounts MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX idx_accounts_status ON accounts(status);
