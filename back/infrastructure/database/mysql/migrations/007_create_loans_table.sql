-- Migration: Create loans table
-- This migration creates the loans table for storing client loans

-- Drop existing table if it exists
DROP TABLE IF EXISTS loans;

CREATE TABLE IF NOT EXISTS loans (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    advisor_id VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    duration INT NOT NULL,
    annual_interest_rate DECIMAL(5, 2) NOT NULL,
    insurance_rate DECIMAL(5, 2) NOT NULL,
    monthly_payment DECIMAL(15, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    total_interest DECIMAL(15, 2) NOT NULL,
    insurance_cost DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_loans_advisor
        FOREIGN KEY (advisor_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_loans_client
        FOREIGN KEY (client_id) REFERENCES users(id)
        ON DELETE CASCADE,

    -- Check constraint for status
    CONSTRAINT loans_status_check
        CHECK (status IN ('ACTIVE', 'COMPLETED', 'DEFAULTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_loans_advisor_id ON loans(advisor_id);
CREATE INDEX idx_loans_client_id ON loans(client_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_created_at ON loans(created_at DESC);
