-- =============================================================================
-- Atelier Tuning Auto - Init DB
-- Instructiuni pgAdmin4:
--   1. Deschide pgAdmin4 -> conecteaza-te la serverul local (localhost:5432)
--   2. Query Tool -> Ruleaza acest fisier (init.sql)
--   3. Apoi ruleaza seed.sql pentru date exemplu
-- =============================================================================

-- NOTA: CREATE USER + CREATE DATABASE se ruleaza doar prima data.
-- Daca userul/database exista, comentati aceste 3 randuri.

DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ilie') THEN
      CREATE ROLE ilie LOGIN PASSWORD '1212';
   END IF;
END
$do$;

-- Rulati aceasta linie separat daca DB nu exista:
-- CREATE DATABASE tuning_shop OWNER ilie;

GRANT ALL PRIVILEGES ON DATABASE tuning_shop TO ilie;

-- Conectati-va la tuning_shop (\c tuning_shop in psql) inainte de urmatoarele:

-- Enum categorie
DROP TYPE IF EXISTS categorie_produs CASCADE;
CREATE TYPE categorie_produs AS ENUM ('Exterior', 'Interior', 'Motor', 'Roti', 'Electronice');

-- Tabel produse
DROP TABLE IF EXISTS asociere_set CASCADE;
DROP TABLE IF EXISTS seturi CASCADE;
DROP TABLE IF EXISTS produse CASCADE;

CREATE TABLE produse (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(200) NOT NULL,
    descriere TEXT NOT NULL,
    imagine TEXT NOT NULL,
    imagini_extra TEXT[] DEFAULT ARRAY[]::TEXT[],
    categorie categorie_produs NOT NULL,
    material VARCHAR(80) NOT NULL,
    pret NUMERIC(10, 2) NOT NULL CHECK (pret >= 0),
    putere_castigata_hp INTEGER NOT NULL DEFAULT 0,
    data_adaugare DATE NOT NULL DEFAULT CURRENT_DATE,
    culoare VARCHAR(60) NOT NULL,
    compatibilitate TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    necesita_montaj_profesionist BOOLEAN NOT NULL DEFAULT false
);

-- Tabel seturi (Bonus 17)
CREATE TABLE seturi (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(200) NOT NULL,
    descriere TEXT NOT NULL,
    imagine TEXT NOT NULL
);

CREATE TABLE asociere_set (
    id_set INTEGER NOT NULL REFERENCES seturi(id) ON DELETE CASCADE,
    id_produs INTEGER NOT NULL REFERENCES produse(id) ON DELETE CASCADE,
    PRIMARY KEY (id_set, id_produs)
);

-- Grant tables to ilie
ALTER TABLE produse OWNER TO ilie;
ALTER TABLE seturi OWNER TO ilie;
ALTER TABLE asociere_set OWNER TO ilie;
ALTER TYPE categorie_produs OWNER TO ilie;

CREATE INDEX idx_produse_categorie ON produse(categorie);
CREATE INDEX idx_produse_pret ON produse(pret);
CREATE INDEX idx_produse_data ON produse(data_adaugare);
