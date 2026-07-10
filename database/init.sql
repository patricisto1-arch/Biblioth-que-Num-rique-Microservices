-- ==========================================================================
-- Schéma relationnel — Bibliothèque Numérique Microservices (MySQL)
-- Un seul schéma partagé entre les 3 services (Livres, Utilisateurs, Emprunts)
-- ==========================================================================

CREATE TABLE IF NOT EXISTS utilisateurs (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    type_utilisateur ENUM('Etudiant', 'Professeur', 'Personnel administratif') NOT NULL,
    date_creation   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS livres (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    titre           VARCHAR(200) NOT NULL,
    auteur          VARCHAR(150) NOT NULL,
    isbn            VARCHAR(20) UNIQUE NOT NULL,
    disponible      BOOLEAN DEFAULT TRUE,
    date_ajout      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emprunts (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    livre_id                INT NOT NULL,
    utilisateur_id           INT NOT NULL,
    date_emprunt            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_retour_prevue      TIMESTAMP NULL,
    date_retour_effective   TIMESTAMP NULL,
    statut                  ENUM('en_cours', 'retourne', 'en_retard') DEFAULT 'en_cours',
    FOREIGN KEY (livre_id) REFERENCES livres(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Quelques données de test
INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur) VALUES
    ('Diop', 'Faty', 'faty.diop@dit.edu', 'Etudiant'),
    ('Ndiaye', 'Amadou', 'amadou.ndiaye@dit.edu', 'Professeur');

INSERT INTO livres (titre, auteur, isbn, disponible) VALUES
    ('Clean Code', 'Robert C. Martin', '9780132350884', TRUE),
    ('Design Patterns', 'Gang of Four', '9780201633610', TRUE);
