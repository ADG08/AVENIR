-- Migration: Add card fields and IBAN to accounts table
-- Date: 2025-12-23

-- Add new columns to accounts table
ALTER TABLE accounts
    ADD COLUMN iban VARCHAR(34) UNIQUE,
    ADD COLUMN name VARCHAR(255),
    ADD COLUMN card_number VARCHAR(16) UNIQUE,
    ADD COLUMN card_holder_name VARCHAR(255),
    ADD COLUMN card_expiry_date VARCHAR(5),
    ADD COLUMN card_cvv VARCHAR(3),
    ADD COLUMN saving_rate_id VARCHAR(255);

-- Add foreign key constraint for saving_rate_id
ALTER TABLE accounts
    ADD CONSTRAINT fk_accounts_saving_rate
    FOREIGN KEY (saving_rate_id) REFERENCES saving_rates(id);

-- Drop old type check constraint and add new one
ALTER TABLE accounts DROP CHECK accounts_chk_1;
ALTER TABLE accounts ADD CONSTRAINT accounts_type_check
    CHECK (type IN ('CURRENT', 'SAVINGS'));

-- Add index for IBAN lookups
CREATE INDEX idx_accounts_iban ON accounts(iban);

-- Make IBAN required for existing rows (if any)
-- UPDATE accounts SET iban = 'FR00000000000000000000000000' WHERE iban IS NULL;
-- Uncomment above line only after generating proper IBANs for existing accounts

-- Alter column to NOT NULL after data migration
-- ALTER TABLE accounts MODIFY iban VARCHAR(34) UNIQUE NOT NULL;
-- Uncomment above line only after ensuring all accounts have IBANs
