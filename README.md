# 📚 Bibliothèque Numérique — Microservices

Projet DevOps L2 DIT — Plateforme web moderne de gestion de bibliothèque, conçue en **architecture microservices** avec Flask, FastAPI, React, PostgreSQL, Docker, Docker Compose et Jenkins.

## 🏗️ Architecture

L'application est découpée en 4 services indépendants, chacun conteneurisé séparément et orchestré via Docker Compose :

| Service | Technologie | Port | Rôle |
|---|---|---|---|
| **Frontend** | React + Vite (servi par nginx) | `3000` | Interface utilisateur (dashboard, livres, utilisateurs, emprunts) |
| **Livres** | FastAPI (Python) | `8001` | Gestion du catalogue de livres |
| **Utilisateurs** | Flask (Python) | `8002` | Gestion des comptes (étudiants, professeurs, personnel) |
| **Emprunts** | Flask (Python) | `8003` | Gestion des emprunts/retours, orchestration inter-services |
| **Base de données** | PostgreSQL 15 | `5432` | Persistance des données |

Le frontend communique avec les trois microservices via un **reverse proxy nginx** (`/api/livres`, `/api/utilisateurs`, `/api/emprunts`), ce qui évite d'exposer directement les ports des services et supprime les problèmes de CORS entre le navigateur et les backends.

## 🚀 Démarrage rapide

### Prérequis
- [Docker](https://www.docker.com/) et Docker Compose installés
- Docker Desktop lancé (Windows/Mac)

### Installation

```bash
git clone https://github.com/patricisto1-arch/Biblioth-que-Num-rique-Microservices.git
cd Biblioth-que-Num-rique-Microservices
```

Copiez le fichier d'environnement d'exemple :

```bash
cp .env.example .env
```

### Lancement

```bash
docker-compose up --build
```

Tous les services démarrent automatiquement dans le bon ordre (la base de données doit être `healthy` avant que les microservices ne démarrent). Le schéma SQL (`database/init.sql`) est chargé automatiquement au premier démarrage.

### Accès à l'application

| Ressource | URL |
|---|---|
| Application (frontend) | http://localhost:3000 |
| API Livres (doc interactive) | http://localhost:8001/docs |
| API Utilisateurs | http://localhost:8002/api/utilisateurs |
| API Emprunts | http://localhost:8003/emprunts |

### Arrêt

```bash
docker-compose down
```

Pour tout réinitialiser (y compris les données de la base) :

```bash
docker-compose down -v
```

## 📁 Structure du projet

```
.
├── database/
│   └── init.sql              # Schéma SQL (tables + relations)
├── frontend/                 # Application React + nginx
├── services/
│   ├── livres/                # Microservice FastAPI
│   ├── utilisateurs/          # Microservice Flask
│   └── emprunts/              # Microservice Flask
├── docs/                      # Documentation complémentaire
├── docker-compose.yml         # Orchestration des services
├── Jenkinsfile                # Pipeline CI/CD
└── .env.example                # Variables d'environnement (exemple)
```

## 🗄️ Modèle de données

Trois tables reliées par des clés étrangères :

- **utilisateurs** : `id`, `nom`, `email`, `type` (étudiant / professeur / personnel)
- **livres** : `id`, `titre`, `auteur`, `isbn`, `disponible`
- **emprunts** : `id`, `utilisateur_id` (FK), `livre_id` (FK), `date_emprunt`, `date_retour`, `statut`

## 🔄 Pipeline CI/CD (Jenkins)

Le `Jenkinsfile` définit un pipeline en 4 étapes :

1. **Checkout** — récupération du code source
2. **Build** — installation des dépendances (pip / npm)
3. **Build images Docker** — construction des images via `docker compose build`
4. **Déploiement** — redémarrage de la stack via `docker compose up -d`

## 👥 Équipe

- **Patrice DIONE** — Schéma base de données, intégration & débogage inter-services, documentation
- **Ndeye Sira DIA** - Développer l'API REST du microservice Utilisateurs avec Flask, dans services/utilisateurs/.
- **Mame Faty DIENG** - Écrire le docker-compose.yml orchestrant tous les services, et le Jenkinsfile automatisant le build/déploiement.
- **Halimatou Sadio DIALLO** - Développer l'API REST du microservice Livres avec Flask, dans services/livres/.
- **Serigne Saliou Mbacke Thiam** - Développer l'interface web dans frontend/, consommant les 3 API (Livres, Utilisateurs, Emprunts).
Commencer avec des données mockées, puis brancher les vraies API dès qu'elles sont prêtes.
- **Aminata Diagne** - Implémentation du micro-service Emprunts : création et retour d'un emprunt, consultation de l'historique (global, par utilisateur, par livre). Le service vérifie l'existence de l'utilisateur et du livre, ainsi que la disponibilité du livre, via des appels REST vers les services Utilisateurs et Livres, puis met à jour la disponibilité du livre après emprunt/retour..
## 📄 Documentation

Un rapport détaillé (architecture, choix techniques, difficultés rencontrées et résolutions) est disponible dans le dossier `docs/`.
