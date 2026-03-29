-- ============================================
-- TVEurosat: Channel data seed (from wykaz kanalow.xlsx)
-- 147 channels, 5 package tier groups
-- Run AFTER migration-channels.sql (schema)
-- ============================================

-- Clean existing channel data
DELETE FROM tv_package_channel_groups;
DELETE FROM tv_channels;
DELETE FROM tv_channel_groups;

-- ============================================
-- 1. Channel groups (one per package tier)
-- ============================================
INSERT INTO tv_channel_groups (slug, name, description, "order", active)
VALUES ('pakiet-mini', 'Pakiet MINI', '56 kanalow - podstawowy pakiet telewizyjny', 1, true);
INSERT INTO tv_channel_groups (slug, name, description, "order", active)
VALUES ('pakiet-komfort', 'Pakiet Komfort', '123 kanaly - rozbudowany pakiet telewizyjny', 2, true);
INSERT INTO tv_channel_groups (slug, name, description, "order", active)
VALUES ('pakiet-max', 'Pakiet MAX', '140 kanalow - bogaty pakiet telewizyjny', 3, true);
INSERT INTO tv_channel_groups (slug, name, description, "order", active)
VALUES ('pakiet-premium', 'Pakiet Premium', '147 kanalow - pelny pakiet telewizyjny', 4, true);
INSERT INTO tv_channel_groups (slug, name, description, "order", active)
VALUES ('pakiet-canal-plus', 'Pakiet CANAL+', '7 kanalow CANAL+ - dodatek premium', 5, true);

-- ============================================
-- 2. All 147 channels
-- Each channel assigned to its LOWEST tier group.
-- Higher tiers include lower groups via junction table.
-- ============================================
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP 1 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 1, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP 2 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 2, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 3, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 4, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TV 4 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 5, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN7 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 6, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT 2 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 7, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT CAFE HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 8, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT PLAY HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 9, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TV TRWAM', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 10, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN STYLE HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 11, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP HISTORIA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 12, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVS HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 13, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TV6 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 14, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TV PULS HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 15, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TELE 5 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 16, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLONIA 1 HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 17, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('METRO TV HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 18, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT VIASAT EXPLORER HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 19, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TTV HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 20, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('WP 1', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 21, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POWER TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 22, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN FABUŁA HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 23, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NOWA TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 24, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('BBC BRIT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 25, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('PULS 2', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 26, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP ROZRYWKA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 28, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FOKUS TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 29, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('REKLAMA TVEUROSAT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 30, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FOOD NETWORK', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 32, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('SUPER POLSAT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 33, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT SERIALE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 34, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('HOME TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 35, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ZOOM TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 36, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT RODZINA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 37, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP DOKUMENT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 38, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP KOBIETA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 39, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP3 WARSZAWA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 40, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP INFO', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 41, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN 24', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 42, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('HGTV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 43, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN 24 BiS', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 44, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT NEWS 2', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 45, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT NEWS', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 46, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('WYDARZENIA 24', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 47, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('REPUBLIKA TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 49, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('wPOLSCE.TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 50, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP WILNO', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 51, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP WORLD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 52, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT FILM', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 61, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ALE KINO+', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 62, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('KINO POLSKA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 63, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('KINO TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 66, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FILMBOX PREMIUM', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 67, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('COMEDY CENTRAL POLSKA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 69, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FOX', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 70, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FOX COMEDY', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 71, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('AXN', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 73, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('AXN WHITE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 74, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('AXN BLACK', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 75, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('STOPKLATKA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 76, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP SERIALE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 78, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NOVELA TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 79, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP SPORT HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 81, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('EUROSPORT 1', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 82, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('EUROSPORT 2', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 83, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT SPORT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 87, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT SPORT EXTRA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 88, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT SPORT NEWS', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 89, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ELEVEN SPORTS 1', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 90, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ELEVEN SPORTS 2', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 91, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ELEVEN SPORTS 3', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 92, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ELEVEN SPORTS 4', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 93, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('MINIMINI+', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 101, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TELETOON', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 102, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('BBC CBEEBIES', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 103, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISNEY CHANNEL', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 104, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FILMBOX FAMILY', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 105, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP ABC', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 106, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT GAMES', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 107, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DUCK TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 108, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DUCK TV PLUS', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 109, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ANTENA TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 120, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP KULTURA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 121, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP POLONIA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 122, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVN TURBO', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 123, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DOMO+', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 124, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('KUCHNIA+', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 125, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('BBC EARTH', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 126, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('BBC LIFESTYLE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 127, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT VIASAT HISTORY', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 128, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCOVERY CHANNEL', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 129, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCOVERY LIFE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 130, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCOVERY HISTORIA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 131, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCOVERY TURBO EXTRA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 132, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('PLANETE+', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 133, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TLC POLAND', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 134, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NATIONAL GEOGRAPHIC', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 135, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NAT GEO WILD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 136, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TRAVEL CHANNEL', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 137, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCOVERY SCIENCE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 138, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('WATER PLANET', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 139, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCOVER ID', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 140, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NICK MUSIC', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 151, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('4FUN TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 152, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('GOLD TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 153, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ESKA TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 154, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLO TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 155, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('4FUN FIT AND DANCE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 156, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('KINO POLSKA MUZYKA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 157, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('VOX MUSIC TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 158, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('STARS TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 159, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('4FUN GOLD HITS', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 160, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT MUSIC', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 161, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ESKA TV EXTRA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 162, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DISCO POLO MUSIC', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 163, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ESKA ROCK', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 164, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('MUSIC BOX UA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 165, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FRANCE 24 HD (ENGLISH)', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 170, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FRANCE 24 HD (FRANCAIS)', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 171, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('DW EUROPA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 174, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('BBC WORLD NEWS', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 176, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('BELSAT TV', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 183, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ DOKUMENT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 200, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT DOCU', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 201, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TVP HD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 202, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ PREMIUM', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 205, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('FILMBOX EXTRA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 207, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NATIONAL GEO', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 209, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ANIMAL PLANET POLAND', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 210, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('NAT GEO WILD', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'), 211, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ SPORT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 213, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ SERIALE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 214, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ FAMILY', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 215, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ 1', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 216, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('CANAL+ SPORT 2', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'), 218, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('POLSAT SPORT FIGHT', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'), 219, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('PR1', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 251, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('PR2', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 252, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('PR3', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 253, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('TOK FM', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 254, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('MUZO.FM', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 257, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('RMF MAXXX', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 258, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('RMF CLASSIC', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 259, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('JASNA GÓRA', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 262, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('PR24', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 263, true);
INSERT INTO tv_channels (name, group_id, "order", active)
VALUES ('ZŁOTE PRZEBOJE', (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'), 264, true);

-- ============================================
-- 3. Link channel groups to TV packages (hierarchical)
-- MINI gets: pakiet-mini
-- Komfort gets: pakiet-mini + pakiet-komfort
-- MAX gets: pakiet-mini + pakiet-komfort + pakiet-max
-- Premium gets: all four groups
-- CANAL+ gets: pakiet-canal-plus only
-- Same mapping for both DVB-C and IPTV packages
-- ============================================
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-mini'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-komfort'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-komfort'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-max'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-max'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-max'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-premium'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-dvbc-canal-plus'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-mini'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-komfort'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-komfort'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-max'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-max'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-max'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-mini'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-komfort'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-max'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-premium'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-premium'));
INSERT INTO tv_package_channel_groups (tv_package_id, channel_group_id)
VALUES ((SELECT id FROM tv_packages WHERE slug = 'tv-iptv-canal-plus'), (SELECT id FROM tv_channel_groups WHERE slug = 'pakiet-canal-plus'));
