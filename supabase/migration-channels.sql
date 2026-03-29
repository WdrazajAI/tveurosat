-- ============================================
-- TVEurosat: TV Channels infrastructure
-- ============================================
-- Tables for managing TV channel logos per package
-- ============================================

-- Channel groups (e.g. "Podstawowe", "Rozrywka", "Sport")
CREATE TABLE IF NOT EXISTS tv_channel_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual TV channels
CREATE TABLE IF NOT EXISTS tv_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  group_id UUID REFERENCES tv_channel_groups(id) ON DELETE SET NULL,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Junction: which channel groups belong to which TV packages
CREATE TABLE IF NOT EXISTS tv_package_channel_groups (
  tv_package_id UUID REFERENCES tv_packages(id) ON DELETE CASCADE,
  channel_group_id UUID REFERENCES tv_channel_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (tv_package_id, channel_group_id)
);

-- Auto-update timestamps
CREATE OR REPLACE TRIGGER set_tv_channel_groups_updated_at
  BEFORE UPDATE ON tv_channel_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER set_tv_channels_updated_at
  BEFORE UPDATE ON tv_channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tv_channels_group_id ON tv_channels(group_id);
CREATE INDEX IF NOT EXISTS idx_tv_channels_active ON tv_channels(active);
CREATE INDEX IF NOT EXISTS idx_tv_channel_groups_active ON tv_channel_groups(active);

-- RLS policies
ALTER TABLE tv_channel_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_package_channel_groups ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read tv_channel_groups" ON tv_channel_groups
  FOR SELECT USING (true);
CREATE POLICY "Public read tv_channels" ON tv_channels
  FOR SELECT USING (true);
CREATE POLICY "Public read tv_package_channel_groups" ON tv_package_channel_groups
  FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "Auth write tv_channel_groups" ON tv_channel_groups
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write tv_channels" ON tv_channels
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write tv_package_channel_groups" ON tv_package_channel_groups
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket for channel logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('channel-logos', 'channel-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for channel logos
CREATE POLICY "Public read channel logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'channel-logos');

-- Authenticated upload for channel logos
CREATE POLICY "Auth upload channel logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'channel-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update channel logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'channel-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete channel logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'channel-logos' AND auth.role() = 'authenticated');
