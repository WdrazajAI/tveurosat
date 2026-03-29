-- ============================================
-- TVEurosat: Orders table
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'failed')),

  -- Selected packages
  internet_package_id TEXT,
  internet_package_name TEXT,
  internet_period TEXT,
  internet_monthly_price NUMERIC(10,2),
  internet_activation_fee NUMERIC(10,2),
  internet_installation_fee NUMERIC(10,2),

  tv_package_id TEXT,
  tv_package_name TEXT,
  tv_period TEXT,
  tv_monthly_price NUMERIC(10,2),
  tv_activation_fee NUMERIC(10,2),
  tv_installation_fee NUMERIC(10,2),

  tv_addons JSONB DEFAULT '[]'::jsonb,

  monthly_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  onetime_total NUMERIC(10,2) NOT NULL DEFAULT 0,

  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  address_city TEXT NOT NULL,
  address_street TEXT,
  address_building TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,

  installation_notes TEXT,

  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous order creation" ON orders
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated read" ON orders
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON orders
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Service role full access" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
