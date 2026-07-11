import os


class Config:
    """Configuration du micro-service Emprunts.

    Toutes les valeurs peuvent être surchargées par des variables
    d'environnement définies dans docker-compose.yml, ce qui évite
    de coder en dur des hostnames ou des mots de passe.
    """

    # Base PostgreSQL partagée par les 3 services (cf. .env.example racine :
    # POSTGRES_DB=bibliotheque, POSTGRES_USER=admin).
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg2://admin:votre_mot_de_passe_ici@database:5432/bibliotheque",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
    }

    LIVRES_SERVICE_URL = os.environ.get("LIVRES_SERVICE_URL", "http://livres-service:8000")
    UTILISATEURS_SERVICE_URL = os.environ.get(
        "UTILISATEURS_SERVICE_URL", "http://utilisateurs:5000"
    )

    PORT = int(os.environ.get("PORT", 5003))