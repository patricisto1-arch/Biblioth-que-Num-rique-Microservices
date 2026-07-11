-- ==========================================
-- Schema : Bibliotheque Numerique Microservices
-- Base : PostgreSQL
-- ==========================================

-- Table Utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('etudiant', 'professeur', 'personnel')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Livres
CREATE TABLE IF NOT EXISTS livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Emprunts
CREATE TABLE IF NOT EXISTS emprunts (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    livre_id INTEGER NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
    date_emprunt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_retour TIMESTAMP,
    statut VARCHAR(20) NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'retourne'))
);

-- Index
CREATE INDEX idx_livres_titre ON livres(titre);
CREATE INDEX idx_livres_auteur ON livres(auteur);
CREATE INDEX idx_emprunts_utilisateur ON emprunts(utilisateur_id);
CREATE INDEX idx_emprunts_livre ON emprunts(livre_id);

-- Donnees de test
INSERT INTO utilisateurs (nom, email, type) VALUES
    ('Fatou Diop', 'fatou.diop@dit.sn', 'etudiant'),
    ('M. Ndiaye', 'ndiaye@dit.sn', 'professeur');

INSERT INTO livres (titre, auteur, isbn, disponible) VALUES
    ('Une si longue lettre', 'Mariama Ba', '978-2708702011', TRUE),
    ('Le Ventre de l''Atlantique', 'Fatou Diome', '978-2253108336', TRUE);
