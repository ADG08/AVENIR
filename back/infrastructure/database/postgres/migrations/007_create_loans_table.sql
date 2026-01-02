-- Migration: Create loans table
-- This migration creates the loans table for storing client loans

-- Drop existing table if it exists
DROP TABLE IF EXISTS loans CASCADE;

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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_loans_advisor_id ON loans(advisor_id);
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_created_at ON loans(created_at DESC);

-- Add comments
COMMENT ON TABLE loans IS 'Table storing client loans';
COMMENT ON COLUMN loans.id IS 'Unique identifier for the loan';
COMMENT ON COLUMN loans.name IS 'Name/purpose of the loan';
COMMENT ON COLUMN loans.advisor_id IS 'ID of the advisor who granted the loan';
COMMENT ON COLUMN loans.client_id IS 'ID of the client who received the loan';
COMMENT ON COLUMN loans.amount IS 'Principal loan amount';
COMMENT ON COLUMN loans.duration IS 'Loan duration in months';
COMMENT ON COLUMN loans.annual_interest_rate IS 'Annual interest rate in percentage';
COMMENT ON COLUMN loans.insurance_rate IS 'Insurance rate in percentage';
COMMENT ON COLUMN loans.monthly_payment IS 'Calculated monthly payment';
COMMENT ON COLUMN loans.total_cost IS 'Total cost of the loan';
COMMENT ON COLUMN loans.total_interest IS 'Total interest paid';
COMMENT ON COLUMN loans.insurance_cost IS 'Total insurance cost';
COMMENT ON COLUMN loans.paid_amount IS 'Amount already paid (source of truth for calculations)';
COMMENT ON COLUMN loans.status IS 'Status of the loan: ACTIVE, COMPLETED, DEFAULTED';
COMMENT ON COLUMN loans.created_at IS 'Timestamp when the loan was created';
COMMENT ON COLUMN loans.updated_at IS 'Timestamp when the loan was last updated';
