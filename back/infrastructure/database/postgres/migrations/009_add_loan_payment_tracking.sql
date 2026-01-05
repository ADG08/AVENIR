-- Migration: Add loan payment tracking fields
-- This migration adds fields to track loan delivery and next payment date

ALTER TABLE loans
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS next_payment_date TIMESTAMP WITH TIME ZONE;

-- Add index for next_payment_date to optimize cron queries
CREATE INDEX IF NOT EXISTS idx_loans_next_payment_date ON loans(next_payment_date) WHERE status = 'ACTIVE';

-- Add comments
COMMENT ON COLUMN loans.delivered_at IS 'Date when the loan amount was delivered to client account';
COMMENT ON COLUMN loans.next_payment_date IS 'Date when the next monthly payment is due';
