-- ============================================
-- TVEurosat v2: Package restructuring migration
-- ============================================
-- Changes:
-- 1. internet_packages.technology: gpon/bsa/docsis/radio → ftth_dom/ftth_blok/ftth_syntis
-- 2. tv_packages.type: iptv/cable → iptv/dvb_c
-- 3. Seed new packages with updated pricing
-- ============================================

-- Step 1: Drop old CHECK constraints
ALTER TABLE internet_packages DROP CONSTRAINT IF EXISTS internet_packages_technology_check;
ALTER TABLE tv_packages DROP CONSTRAINT IF EXISTS tv_packages_type_check;

-- Step 2: Add new CHECK constraints
ALTER TABLE internet_packages ADD CONSTRAINT internet_packages_technology_check
  CHECK (technology IN ('ftth_dom', 'ftth_blok', 'ftth_syntis'));

ALTER TABLE tv_packages ADD CONSTRAINT tv_packages_type_check
  CHECK (type IN ('iptv', 'dvb_c'));

-- Step 3: Deactivate all old packages
UPDATE internet_packages SET active = false;
UPDATE tv_packages SET active = false;

-- Step 4: Insert new internet packages

-- FTTH Dom (dom jednorodzinny)
INSERT INTO internet_packages (slug, name, technology, tagline, speed_down, speed_up, features, pricing, featured, "order", active)
VALUES
  ('ftth-dom-start', 'Start', 'ftth_dom', 'Idealny na start — przeglądanie, social media, streaming', 300, 100,
   '["Prędkość do 300 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":79,"activationFee":69,"installationFee":299},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":89,"activationFee":99,"installationFee":399},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":99,"activationFee":199,"installationFee":499}]'::jsonb,
   false, 1, true),

  ('ftth-dom-standard', 'Standard', 'ftth_dom', 'Dla rodziny — streaming 4K, praca zdalna, gry online', 600, 200,
   '["Prędkość do 600 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie techniczne", "Streaming 4K bez buforowania"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":89,"activationFee":69,"installationFee":299},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":99,"activationFee":99,"installationFee":399},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":109,"activationFee":199,"installationFee":499}]'::jsonb,
   true, 2, true),

  ('ftth-dom-premium', 'Premium', 'ftth_dom', 'Dla wymagających — granie, telepraca, wiele urządzeń', 900, 300,
   '["Prędkość do 900 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie VIP", "Symetryczny upload 300 Mb/s"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":99,"activationFee":69,"installationFee":299},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":109,"activationFee":99,"installationFee":399},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":119,"activationFee":199,"installationFee":499}]'::jsonb,
   false, 3, true);

-- FTTH Blok (wielorodzinny)
INSERT INTO internet_packages (slug, name, technology, tagline, speed_down, speed_up, features, pricing, featured, "order", active)
VALUES
  ('ftth-blok-standard', 'Standard', 'ftth_blok', 'Szybki internet dla mieszkania — streaming, praca zdalna', 450, 200,
   '["Prędkość do 450 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie techniczne", "Streaming 4K bez buforowania"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":64,"activationFee":49,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":74,"activationFee":99,"installationFee":199},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":84,"activationFee":199,"installationFee":199}]'::jsonb,
   true, 1, true),

  ('ftth-blok-premium', 'Premium', 'ftth_blok', 'Najszybszy internet w bloku — bez kompromisów', 900, 450,
   '["Prędkość do 900 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie VIP", "Symetryczny upload 450 Mb/s"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":74,"activationFee":49,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":84,"activationFee":99,"installationFee":199},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":94,"activationFee":199,"installationFee":199}]'::jsonb,
   false, 2, true);

-- FTTH Syntis (infrastruktura innego operatora)
INSERT INTO internet_packages (slug, name, technology, tagline, speed_down, speed_up, features, pricing, featured, "order", active)
VALUES
  ('ftth-syntis-start', 'Start', 'ftth_syntis', 'Internet światłowodowy przez infrastrukturę operatora', 300, 100,
   '["Prędkość do 300 Mb/s", "Router Wi-Fi w cenie", "Bez limitu danych", "Wsparcie techniczne 24/7"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":79,"activationFee":69,"installationFee":299},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":94,"activationFee":99,"installationFee":399},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":109,"activationFee":199,"installationFee":499}]'::jsonb,
   false, 1, true),

  ('ftth-syntis-standard', 'Standard', 'ftth_syntis', 'Szybki internet światłowodowy przez sieć operatora', 600, 200,
   '["Prędkość do 600 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Streaming 4K bez buforowania"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":89,"activationFee":69,"installationFee":299},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":104,"activationFee":99,"installationFee":399},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":119,"activationFee":199,"installationFee":499}]'::jsonb,
   true, 2, true),

  ('ftth-syntis-premium', 'Premium', 'ftth_syntis', 'Wydajny internet światłowodowy przez sieć operatora', 900, 300,
   '["Prędkość do 900 Mb/s", "Router Wi-Fi 6 w cenie", "Bez limitu danych", "Priorytetowe wsparcie"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":99,"activationFee":69,"installationFee":299},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":114,"activationFee":99,"installationFee":399},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":129,"activationFee":199,"installationFee":499}]'::jsonb,
   false, 3, true);

-- Step 5: Insert new TV packages

-- DVB-C packages
INSERT INTO tv_packages (slug, name, type, tagline, channels, features, pricing, featured, "order", active)
VALUES
  ('tv-dvbc-mini', 'MINI', 'dvb_c', 'Podstawowa telewizja kablowa — najważniejsze kanały', 46,
   '["46 kanałów HD i SD", "TVP, Polsat, TVN i więcej", "Bez potrzeby internetu"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":35,"activationFee":99,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":45,"activationFee":99,"installationFee":1},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":55,"activationFee":99,"installationFee":1}]'::jsonb,
   false, 1, true),

  ('tv-dvbc-komfort', 'Komfort', 'dvb_c', 'Rozbudowana telewizja — coś dla każdego', 113,
   '["113 kanałów HD i SD", "Kanały rozrywkowe i filmowe", "Kanały sportowe", "Bez potrzeby internetu"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":59,"activationFee":99,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":69,"activationFee":99,"installationFee":1},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":79,"activationFee":99,"installationFee":1}]'::jsonb,
   true, 2, true),

  ('tv-dvbc-max', 'MAX', 'dvb_c', 'Bogaty pakiet kanałów — filmy, sport, rozrywka', 130,
   '["130 kanałów HD i SD", "Kanały premium", "Sport w HD", "Kanały dokumentalne i naukowe", "Bez potrzeby internetu"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":79,"activationFee":99,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":89,"activationFee":99,"installationFee":1},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":99,"activationFee":99,"installationFee":1}]'::jsonb,
   false, 3, true),

  ('tv-dvbc-premium', 'Premium', 'dvb_c', 'Pełnia rozrywki — wszystkie kanały w najlepszej jakości', 137,
   '["137 kanałów HD i SD", "Wszystkie pakiety premium", "Sport w HD", "Filmy i seriale", "Bez potrzeby internetu"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":119,"activationFee":99,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":129,"activationFee":99,"installationFee":1},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":139,"activationFee":99,"installationFee":1}]'::jsonb,
   false, 4, true),

  ('tv-dvbc-canal-plus', 'CANAL+', 'dvb_c', 'Pakiet CANAL+ — kino, sport, seriale', 7,
   '["7 kanałów CANAL+", "Filmy kinowe w premierze", "Liga Mistrzów i Ekstraklasa", "Bez potrzeby internetu"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":49,"activationFee":99,"installationFee":1},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":59,"activationFee":99,"installationFee":1},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":69,"activationFee":99,"installationFee":1}]'::jsonb,
   false, 5, true);

-- IPTV packages
INSERT INTO tv_packages (slug, name, type, tagline, channels, features, pricing, featured, "order", active)
VALUES
  ('tv-iptv-mini', 'MINI', 'iptv', 'Podstawowa telewizja IPTV — najważniejsze kanały', 46,
   '["46 kanałów HD i SD", "TVP, Polsat, TVN i więcej", "Przewodnik elektroniczny EPG", "Wymagany internet"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":45,"activationFee":0,"installationFee":0},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":55,"activationFee":0,"installationFee":0},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":65,"activationFee":0,"installationFee":0}]'::jsonb,
   false, 1, true),

  ('tv-iptv-komfort', 'Komfort', 'iptv', 'Rozbudowana telewizja IPTV — coś dla każdego', 113,
   '["113 kanałów HD i SD", "Kanały rozrywkowe i filmowe", "Kanały sportowe", "Nagrywanie programów (PVR)", "Wymagany internet"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":69,"activationFee":0,"installationFee":0},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":79,"activationFee":0,"installationFee":0},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":89,"activationFee":0,"installationFee":0}]'::jsonb,
   true, 2, true),

  ('tv-iptv-max', 'MAX', 'iptv', 'Bogaty pakiet IPTV — filmy, sport, rozrywka', 130,
   '["130 kanałów HD i SD", "Kanały premium", "Sport w HD", "Timeshift i nagrywanie", "Wymagany internet"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":89,"activationFee":0,"installationFee":0},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":99,"activationFee":0,"installationFee":0},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":109,"activationFee":0,"installationFee":0}]'::jsonb,
   false, 3, true),

  ('tv-iptv-premium', 'Premium', 'iptv', 'Pełnia rozrywki IPTV — wszystkie kanały w najlepszej jakości', 137,
   '["137 kanałów HD i SD", "Wszystkie pakiety premium", "Sport w HD", "3 urządzenia jednocześnie", "Wymagany internet"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":129,"activationFee":0,"installationFee":0},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":139,"activationFee":0,"installationFee":0},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":149,"activationFee":0,"installationFee":0}]'::jsonb,
   false, 4, true),

  ('tv-iptv-canal-plus', 'CANAL+', 'iptv', 'Pakiet CANAL+ IPTV — kino, sport, seriale', 7,
   '["7 kanałów CANAL+", "Filmy kinowe w premierze", "Liga Mistrzów i Ekstraklasa", "Wymagany internet"]'::jsonb,
   '[{"period":"24m","periodLabel":"Umowa 24 mies.","monthlyPrice":59,"activationFee":0,"installationFee":0},{"period":"12m","periodLabel":"Umowa 12 mies.","monthlyPrice":69,"activationFee":0,"installationFee":0},{"period":"indefinite","periodLabel":"Bez umowy","monthlyPrice":79,"activationFee":0,"installationFee":0}]'::jsonb,
   false, 5, true);
