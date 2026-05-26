-- =============================================================================
-- Seed data - 20 piese de tuning auto
-- =============================================================================

INSERT INTO produse (nume, descriere, imagine, imagini_extra, categorie, material, pret, putere_castigata_hp, data_adaugare, culoare, compatibilitate, necesita_montaj_profesionist) VALUES

-- Exterior
('Spoiler Carbon GT Wing', 'Spoiler tip GT Wing din fibra de carbon pre-preg, reduce lift-ul la viteze mari si adauga apasare aerodinamica. Design agresiv racing, testat in tunel de vant.', 'https://images.unsplash.com/photo-1621712151262-60bd142ba19f?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'], 'Exterior', 'carbon', 2450.00, 0, CURRENT_DATE - INTERVAL '3 days', 'Negru mat', ARRAY['BMW E46','BMW E90','Audi A4 B8','VW Golf 6'], true),

('Bara Fata Sport R-Line', 'Bara fata replica R-Line cu prize de aer functionale si splitter frontal integrat. Aspect sport agresiv.', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'], 'Exterior', 'fibra', 1890.00, 0, CURRENT_DATE - INTERVAL '15 days', 'Nevopsit', ARRAY['VW Golf 7','VW Golf 7.5'], true),

('Difuzor Spate Aluminiu CNC', 'Difuzor spate frezat CNC din aluminiu aviatic 6061, cu 4 canale aerodinamice. Finisaj anodizat.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Exterior', 'aluminiu', 1120.00, 0, CURRENT_DATE - INTERVAL '45 days', 'Gri titan', ARRAY['BMW F30','BMW F32','Audi A5 B9'], false),

('Praguri Laterale Carbon Twill', 'Praguri laterale extinse din carbon twill 3K, finisaj lucios UV protected. Se monteaza cu adeziv 3M profesional.', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Exterior', 'carbon', 980.00, 0, CURRENT_DATE - INTERVAL '120 days', 'Negru carbon', ARRAY['Audi A4 B8','Audi A5 B8','Audi RS4'], false),

-- Interior
('Volan Sport Alcantara Piele', 'Volan sport cu diametru 350mm, invelit in Alcantara sus si piele Nappa pe laterale. Cusaturi rosii contrast, marcaj punct mort la 12.', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Interior', 'piele', 1560.00, 0, CURRENT_DATE - INTERVAL '7 days', 'Negru cusaturi rosii', ARRAY['Audi A3 8V','Audi A4 B8','Audi RS3'], true),

('Scaune Recaro Pole Position', 'Scaune sport recaro pole position, cadru fibra + tapiterie Dinamica. Omologare FIA 8855-1999.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Interior', 'fibra', 8900.00, 0, CURRENT_DATE - INTERVAL '90 days', 'Negru cu rosu', ARRAY['universal cu adaptor'], true),

('Pedaliera Aluminiu CNC', 'Set pedaliera din aluminiu frezat CNC, cauciuc antiderapant si stub-uri de fixare. Kit complet 3 pedale + odihna.', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Interior', 'aluminiu', 220.00, 0, CURRENT_DATE - INTERVAL '200 days', 'Argintiu', ARRAY['universal'], false),

('Buton Start Rosu Illuminat', 'Buton Engine Start iluminat LED rosu, capac argintiu anodizat. Plug and play pentru masini cu Keyless Go.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Interior', 'aluminiu', 89.00, 0, CURRENT_DATE - INTERVAL '10 days', 'Rosu / Argintiu', ARRAY['BMW F30','BMW F10','BMW E90 LCI'], false),

-- Motor
('Sistem Evacuare Inox Cat-Back', 'Sistem evacuare complet cat-back din inox T304, diametru 76mm. Toba finala oval carbon. Sunet sport dar civilizat.', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Motor', 'inox', 4200.00, 18, CURRENT_DATE - INTERVAL '5 days', 'Inox polisat', ARRAY['VW Golf 7 GTI','VW Golf 7 R','Audi S3 8V'], true),

('Chip Tuning Stage 1 ECU', 'Remapare ECU Stage 1 pentru motoare TSI/TDI. Fisier custom pe bancul de teste. Crestere 30-45CP + 60-80Nm.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Motor', 'plastic', 1500.00, 42, CURRENT_DATE - INTERVAL '2 days', 'N/A', ARRAY['VW Golf 7','Audi A3 8V','Audi A4 B9','Skoda Octavia 3'], true),

('Intercooler Racing FMIC', 'Intercooler front-mount marit, core 600x300x100mm bar-and-plate. Reduce IAT-ul cu pana la 30 grade C.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Motor', 'aluminiu', 2650.00, 12, CURRENT_DATE - INTERVAL '25 days', 'Negru vopsit', ARRAY['BMW N54','BMW N55','BMW S55'], true),

('Filtru Aer Sport K&N', 'Filtru sport universal K&N cu inductie directa. Kit include tub aluminiu si carcasa termica de protectie.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Motor', 'aluminiu', 780.00, 8, CURRENT_DATE - INTERVAL '60 days', 'Rosu / Aluminiu', ARRAY['BMW F30','Audi A4 B8','VW Golf 6'], false),

-- Roti
('Janta Forjata R19 5x112', 'Janta forjata monobloc 8.5J x 19 ET35, 5x112. Ultra usoara 8.9kg/buc. Finisaj brushed titanium.', 'https://images.unsplash.com/photo-1542377281-73d08e3a10aa?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1621712151262-60bd142ba19f?w=800&q=80'], 'Roti', 'aluminiu', 3200.00, 0, CURRENT_DATE - INTERVAL '4 days', 'Titan brushed', ARRAY['Audi A4 B8','Audi A5','VW Golf 7','VW Passat B8'], false),

('Janta Turnata R18 5x120', 'Janta turnata OEM style 8J x 18 ET34, 5x120. Design 10 spite duble. Vopsea neagra lucioasa.', 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Roti', 'aluminiu', 1450.00, 0, CURRENT_DATE - INTERVAL '35 days', 'Negru lucios', ARRAY['BMW E90','BMW F30','BMW E46'], false),

('Set Suruburi Coliseum Titan', 'Set 20 suruburi Coliseum din titan grad 5, filet M14x1.5, cheie 17. Ultra usor si rezistent la coroziune.', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Roti', 'aluminiu', 640.00, 0, CURRENT_DATE - INTERVAL '150 days', 'Argintiu titan', ARRAY['universal 5x100','universal 5x112','universal 5x120'], false),

('Distantiere Roti Hubcentric 20mm', 'Distantiere aluminiu hubcentric 20mm, prezoane M14x1.5, suruburi radiale. Aspect flush.', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Roti', 'aluminiu', 380.00, 0, CURRENT_DATE - INTERVAL '80 days', 'Argintiu anodizat', ARRAY['Audi A3','Audi A4','VW Golf'], false),

-- Electronice
('Kit LED Faruri H7 12000lm', 'Kit LED faruri H7 CANbus, 12000 lm per pereche, chip CSP Philips, 6000K alb. Ventilator activ.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Electronice', 'plastic', 340.00, 0, CURRENT_DATE - INTERVAL '12 days', 'Alb 6000K', ARRAY['universal H7'], false),

('Camera Marsalier HD Nightvision', 'Camera marsalier HD 1080p cu nightvision IR, unghi 170 grade, IP68. Cablu 6m RCA + trigger reverse.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Electronice', 'plastic', 260.00, 0, CURRENT_DATE - INTERVAL '20 days', 'Negru', ARRAY['universal 12V'], false),

('Modul Coding OBD BimmerCode', 'Interfata OBD Bluetooth pentru coding BMW/Mini. Compatibil aplicatia BimmerCode/Carly. Include licenta 1 an.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Electronice', 'plastic', 480.00, 0, CURRENT_DATE - INTERVAL '18 days', 'Alb / Albastru', ARRAY['BMW F seria','BMW G seria','MINI F seria'], false),

('Head-Up Display HUD-X Pro', 'Head-up display OBD2 cu proiectie color pe parbriz. Afiseaza viteza, RPM, temperatura, consum. Auto-off.', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=srgb&fm=jpg&w=800&q=80', ARRAY[]::TEXT[], 'Electronice', 'plastic', 420.00, 0, CURRENT_DATE - INTERVAL '1 days', 'Negru', ARRAY['universal OBD2'], false);

-- Seturi (Bonus 17)
INSERT INTO seturi (nume, descriere, imagine) VALUES
('Pachet Aerodinamic Complet', 'Spoiler + Bara fata + Difuzor + Praguri - transforma complet aspectul.', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'),
('Pachet Motor Stage 1', 'Chip tuning + Evacuare + Filtru sport + Intercooler.', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=800&q=80'),
('Pachet Interior Race', 'Volan + Scaune + Pedaliera + Buton start.', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'),
('Pachet Roti & Suspensie', 'Un set pentru a imbunatati manevrabilitatea si aspectul rotilor.', 'https://images.unsplash.com/photo-1542377281-73d08e3a10aa?w=800&q=80'),
('Pachet Electronică Esențială', 'Upgrade-uri electronice esentiale pentru o experienta de condus moderna.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80');

-- Asocieri seturi
INSERT INTO asociere_set (id_set, id_produs) VALUES
(1, 1),(1, 2),(1, 3),(1, 4),
(2, 9),(2, 10),(2, 11),(2, 12),
(3, 5),(3, 6),(3, 7),(3, 8),
(4, 13), (4, 16),
(5, 17), (5, 20);
