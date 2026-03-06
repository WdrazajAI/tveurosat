-- TV Eurosat Admin Panel - Database Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. TABLES
-- ============================================

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('promotion', 'news', 'expansion', 'maintenance')),
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'technical', 'billing', 'installation')),
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pricelist', 'regulation', 'form', 'technical')),
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE internet_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  technology TEXT NOT NULL CHECK (technology IN ('gpon', 'bsa', 'docsis', 'radio')),
  tagline TEXT NOT NULL,
  speed_down INTEGER NOT NULL,
  speed_up INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  pricing JSONB NOT NULL DEFAULT '[]',
  featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  tariff_code TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tv_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('iptv', 'cable')),
  tagline TEXT NOT NULL,
  channels INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  pricing JSONB NOT NULL DEFAULT '[]',
  featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  tariff_code TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON faq
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON internet_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tv_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE internet_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_packages ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key)
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);
CREATE POLICY "Public read documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Public read internet_packages" ON internet_packages FOR SELECT USING (true);
CREATE POLICY "Public read tv_packages" ON tv_packages FOR SELECT USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin insert news" ON news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update news" ON news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete news" ON news FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert faq" ON faq FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update faq" ON faq FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete faq" ON faq FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert documents" ON documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update documents" ON documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete documents" ON documents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert internet_packages" ON internet_packages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update internet_packages" ON internet_packages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete internet_packages" ON internet_packages FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert tv_packages" ON tv_packages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update tv_packages" ON tv_packages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete tv_packages" ON tv_packages FOR DELETE TO authenticated USING (true);

-- ============================================
-- 4. STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read documents storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Admin upload documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Admin update documents storage" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'documents');

CREATE POLICY "Admin delete documents storage" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'documents');
