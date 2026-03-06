-- TV Eurosat - Coverage Data Migration
-- Tabela przechowująca dane o zasięgu usług na konkretnych adresach
-- Uruchom w Supabase SQL Editor

-- ============================================
-- 1. CREATE COVERAGE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identyfikator adresu
  address_id TEXT UNIQUE NOT NULL,  -- np. "514495_99999_11"

  -- Lokalizacja
  simc_code TEXT NOT NULL,          -- kod SIMC miejscowości
  locality TEXT NOT NULL,           -- nazwa miejscowości (Prostyń, Złotki, etc.)
  teryt_code TEXT,                  -- kod TERYT
  street TEXT,                      -- ulica (może być pusta)
  street_code TEXT,                 -- kod ulicy
  building_number TEXT NOT NULL,    -- numer budynku

  -- Współrzędne GPS
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,

  -- Technologia
  medium TEXT NOT NULL,             -- "światłowodowe", "radiowe (FWA)"
  technology TEXT NOT NULL,         -- "GPON", "inna"
  speed_down INTEGER NOT NULL,      -- prędkość pobierania Mbps
  speed_up INTEGER NOT NULL,        -- prędkość wysyłania Mbps
  speed_type TEXT DEFAULT 'rzeczywisty', -- "rzeczywisty" lub "teoretyczny"

  -- Dostępność usług
  internet_available BOOLEAN DEFAULT true,
  tv_available BOOLEAN DEFAULT true,

  -- Operator
  operator TEXT DEFAULT 'TVEUROSAT',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index dla wyszukiwania po miejscowości
CREATE INDEX IF NOT EXISTS idx_coverage_locality ON coverage(locality);
CREATE INDEX IF NOT EXISTS idx_coverage_technology ON coverage(technology);
CREATE INDEX IF NOT EXISTS idx_coverage_coords ON coverage(latitude, longitude);

-- Trigger dla auto-update updated_at
CREATE TRIGGER set_updated_at_coverage
  BEFORE UPDATE ON coverage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE coverage ENABLE ROW LEVEL SECURITY;

-- Public read access (dla sprawdzania dostępności)
CREATE POLICY "Public read coverage" ON coverage
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin insert coverage" ON coverage
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update coverage" ON coverage
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete coverage" ON coverage
  FOR DELETE TO authenticated USING (true);

-- ============================================
-- 3. HELPER FUNCTION: Check coverage by coordinates
-- ============================================

CREATE OR REPLACE FUNCTION find_coverage_by_coords(
  lat DECIMAL,
  lng DECIMAL,
  radius_meters INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  address_id TEXT,
  locality TEXT,
  street TEXT,
  building_number TEXT,
  technology TEXT,
  speed_down INTEGER,
  speed_up INTEGER,
  internet_available BOOLEAN,
  tv_available BOOLEAN,
  distance_meters FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.address_id,
    c.locality,
    c.street,
    c.building_number,
    c.technology,
    c.speed_down,
    c.speed_up,
    c.internet_available,
    c.tv_available,
    -- Haversine formula for distance in meters
    (6371000 * acos(
      cos(radians(lat)) * cos(radians(c.latitude)) *
      cos(radians(c.longitude) - radians(lng)) +
      sin(radians(lat)) * sin(radians(c.latitude))
    )) AS distance_meters
  FROM coverage c
  WHERE
    -- Quick bounding box filter first (approx 1 degree = 111km)
    c.latitude BETWEEN lat - (radius_meters::FLOAT / 111000) AND lat + (radius_meters::FLOAT / 111000)
    AND c.longitude BETWEEN lng - (radius_meters::FLOAT / 111000 / cos(radians(lat))) AND lng + (radius_meters::FLOAT / 111000 / cos(radians(lat)))
  ORDER BY distance_meters
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. HELPER FUNCTION: Search by locality name
-- ============================================

CREATE OR REPLACE FUNCTION search_coverage_by_locality(
  search_term TEXT
)
RETURNS TABLE (
  locality TEXT,
  street TEXT,
  building_number TEXT,
  technology TEXT,
  speed_down INTEGER,
  internet_available BOOLEAN,
  tv_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    c.locality,
    c.street,
    c.building_number,
    c.technology,
    c.speed_down,
    c.internet_available,
    c.tv_available
  FROM coverage c
  WHERE
    c.locality ILIKE '%' || search_term || '%'
    OR c.street ILIKE '%' || search_term || '%'
  ORDER BY c.locality, c.street, c.building_number
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;
