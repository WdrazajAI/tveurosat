-- TV Eurosat - Packages Data Import
-- Wygenerowano na podstawie src/data/packages.ts
-- Uruchom w Supabase SQL Editor PO migration.sql

-- ============================================
-- 1. INTERNET PACKAGES - GPON
-- ============================================

INSERT INTO internet_packages (slug, name, technology, tagline, speed_down, speed_up, features, pricing, featured, "order")
VALUES
  ('gpon-100', 'Start', 'gpon', 'Idealny na start — przeglądanie, social media, streaming', 100, 30,
   '["Prędkość do 100 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 59, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 69, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 79, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 1),

  ('gpon-300', 'Standard', 'gpon', 'Dla rodziny — streaming 4K, praca zdalna, gry online', 300, 50,
   '["Prędkość do 300 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie techniczne", "Streaming 4K bez buforowania"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 89, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 99, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 109, "activationFee": 49, "installationFee": 99}]'::jsonb,
   true, 2),

  ('gpon-600', 'Premium', 'gpon', 'Dla wymagających — granie, telepraca, wiele urządzeń', 600, 100,
   '["Prędkość do 600 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie VIP", "Symetryczny upload"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 119, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 129, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 139, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 3),

  ('gpon-1000', 'Ultra', 'gpon', 'Maksimum mocy — bez kompromisów', 1000, 500,
   '["Prędkość do 1 Gb/s", "Router Wi-Fi 6E w cenie", "Bez limitu danych", "Dedykowany opiekun klienta", "Symetryczny upload 500 Mb/s", "Gwarancja najniższego pingu"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 149, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 159, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 179, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 4)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  technology = EXCLUDED.technology,
  tagline = EXCLUDED.tagline,
  speed_down = EXCLUDED.speed_down,
  speed_up = EXCLUDED.speed_up,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- ============================================
-- 2. INTERNET PACKAGES - BSA
-- ============================================

INSERT INTO internet_packages (slug, name, technology, tagline, speed_down, speed_up, features, pricing, featured, "order")
VALUES
  ('bsa-100', 'Start BSA', 'bsa', 'Internet światłowodowy przez sieć Orange', 100, 20,
   '["Prędkość do 100 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 65, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 75, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 85, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 1),

  ('bsa-300', 'Standard BSA', 'bsa', 'Szybki internet dla rodziny przez sieć Orange', 300, 40,
   '["Prędkość do 300 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Streaming 4K bez buforowania"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 95, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 105, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 115, "activationFee": 49, "installationFee": 99}]'::jsonb,
   true, 2),

  ('bsa-600', 'Premium BSA', 'bsa', 'Wydajny internet światłowodowy przez sieć Orange', 600, 80,
   '["Prędkość do 600 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 129, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 139, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 149, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 3)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  technology = EXCLUDED.technology,
  tagline = EXCLUDED.tagline,
  speed_down = EXCLUDED.speed_down,
  speed_up = EXCLUDED.speed_up,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- ============================================
-- 3. INTERNET PACKAGES - DOCSIS
-- ============================================

INSERT INTO internet_packages (slug, name, technology, tagline, speed_down, speed_up, features, pricing, featured, "order")
VALUES
  ('docsis-100', 'Start Kablowy', 'docsis', 'Internet kablowy — sprawdzona technologia', 100, 10,
   '["Prędkość do 100 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 55, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 65, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 75, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 1),

  ('docsis-250', 'Standard Kablowy', 'docsis', 'Solidny internet kablowy dla całej rodziny', 250, 25,
   '["Prędkość do 250 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Streaming HD i 4K"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 79, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 89, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 99, "activationFee": 49, "installationFee": 99}]'::jsonb,
   true, 2)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  technology = EXCLUDED.technology,
  tagline = EXCLUDED.tagline,
  speed_down = EXCLUDED.speed_down,
  speed_up = EXCLUDED.speed_up,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- ============================================
-- 4. TV PACKAGES - IPTV
-- ============================================

INSERT INTO tv_packages (slug, name, type, tagline, channels, features, pricing, featured, "order")
VALUES
  ('tv-iptv-basic', 'TV Start', 'iptv', 'Podstawowa rozrywka — wiadomości, sport, filmy', 60,
   '["60+ kanałów", "Kanały HD w pakiecie", "TVP, Polsat, TVN i więcej", "Przewodnik elektroniczny EPG"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 35, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 39, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 45, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 1),

  ('tv-iptv-standard', 'TV Rodzinny', 'iptv', 'Coś dla każdego — rozbudowany pakiet kanałów', 110,
   '["110+ kanałów", "Kanały premium (Canal+, HBO)", "Kanały sportowe", "Nagrywanie programów (PVR)", "Aplikacja mobilna"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 55, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 59, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 65, "activationFee": 49, "installationFee": 99}]'::jsonb,
   true, 2),

  ('tv-iptv-premium', 'TV Premium', 'iptv', 'Pełnia rozrywki — wszystkie kanały, najlepsza jakość', 160,
   '["160+ kanałów HD i 4K", "Wszystkie pakiety premium", "Canal+, HBO, Netflix basic", "Sport w 4K", "Timeshift i nagrywanie", "3 urządzenia jednocześnie"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 79, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 85, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 95, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 3)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  tagline = EXCLUDED.tagline,
  channels = EXCLUDED.channels,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- ============================================
-- 5. TV PACKAGES - CABLE
-- ============================================

INSERT INTO tv_packages (slug, name, type, tagline, channels, features, pricing, featured, "order")
VALUES
  ('tv-cable-basic', 'TV Kablowa', 'cable', 'Tradycyjna telewizja kablowa — prosta i niezawodna', 50,
   '["50+ kanałów", "Jakość cyfrowa HD", "Bez potrzeby dekodera", "Prosty sygnał kablowy"]'::jsonb,
   '[{"period": "24m", "periodLabel": "Umowa 24 mies.", "monthlyPrice": 30, "activationFee": 0, "installationFee": 0}, {"period": "12m", "periodLabel": "Umowa 12 mies.", "monthlyPrice": 35, "activationFee": 1, "installationFee": 0}, {"period": "indefinite", "periodLabel": "Bez umowy", "monthlyPrice": 40, "activationFee": 49, "installationFee": 99}]'::jsonb,
   false, 1)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  tagline = EXCLUDED.tagline,
  channels = EXCLUDED.channels,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Internet packages:' AS info, COUNT(*) AS count FROM internet_packages;
SELECT 'TV packages:' AS info, COUNT(*) AS count FROM tv_packages;
