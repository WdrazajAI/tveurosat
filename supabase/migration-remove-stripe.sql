-- Migration: Remove Stripe integration, simplify orders table
-- Date: 2026-03-28

-- Remove Stripe-specific columns
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_session_id;
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_payment_intent_id;
ALTER TABLE orders DROP COLUMN IF EXISTS paid_at;

-- Drop the Stripe session index
DROP INDEX IF EXISTS idx_orders_stripe_session;

-- Update status constraint: remove 'paid' and 'failed' (no payments)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Add contacted_at for tracking when office staff contacts customer
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ;
