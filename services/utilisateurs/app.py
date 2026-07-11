import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import psycopg2.errors

app = Flask(__name__)
# Active CORS pour toutes les routes pour faciliter l'intégration avec le frontend
CORS(app)

# Configuration de la base de données via variables d'environnement
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'rootpassword')
DB_NAME = os.environ.get('DB_NAME', 'bibliotheque')
DB_PORT = int(os.environ.get('DB_PORT', 5432))

def get_db_connection():
    """
    Crée et retourne une nouvelle connexion à la base de données PostgreSQL.
    """
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        dbname=DB_NAME,
        port=DB_PORT,
        cursor_factory=psycopg2.extras.RealDictCursor
    )

@app.route('/health', methods=['GET'])
def health():
    """
    Vérification de la santé du service et de sa connexion à la base de données.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        connection.close()
        return jsonify({"status": "UP", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "DOWN", "database": "disconnected", "error": str(e)}), 500

@app.route('/api/utilisateurs', methods=['POST'])
def create_user():
    
    data = request.get_json() or {}
    nom = data.get('nom')
    email = data.get('email')
    role = data.get('role')

    # Validations de base
    if not nom or not email or not role:
        return jsonify({"error": "Champs requis manquants: 'nom', 'email', 'role'"}), 400

    # Validation du rôle - valeurs alignées sur la contrainte CHECK de la table 'utilisateurs'
    allowed_roles = ['etudiant', 'professeur', 'personnel']
    if role not in allowed_roles:
        return jsonify({
            "error": f"Rôle '{role}' invalide.",
            "roles_autorises": allowed_roles
        }), 400

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Insertion du nouvel utilisateur - RETURNING id récupère l'ID généré (syntaxe PostgreSQL)
            sql = "INSERT INTO utilisateurs (nom, email, type) VALUES (%s, %s, %s) RETURNING id"
            cursor.execute(sql, (nom, email, role))
            user_id = cursor.fetchone()['id']
        connection.commit()

        # Récupération des informations insérées (alias type -> role pour l'API)
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nom, email, type AS role, date_creation FROM utilisateurs WHERE id = %s", (user_id,))
            created_user = cursor.fetchone()
        connection.close()

        # Formatage de la date en ISO format
        if created_user and created_user.get('date_creation'):
            created_user['date_creation'] = created_user['date_creation'].isoformat()

        return jsonify(dict(created_user)), 201

    except psycopg2.errors.UniqueViolation:
        # Violation de contrainte UNIQUE (email déjà existant) sous PostgreSQL
        if connection:
            connection.rollback()
            connection.close()
        return jsonify({"error": f"L'adresse email '{email}' est déjà enregistrée."}), 400
    except psycopg2.errors.CheckViolation:
        # Violation de la contrainte CHECK sur la colonne 'type'
        if connection:
            connection.rollback()
            connection.close()
        return jsonify({
            "error": f"Rôle '{role}' invalide.",
            "roles_autorises": allowed_roles
        }), 400
    except Exception as e:
        if connection:
            connection.rollback()
            connection.close()
        return jsonify({"error": "Erreur serveur lors de la création.", "details": str(e)}), 500

@app.route('/api/utilisateurs', methods=['GET'])
def list_users():

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nom, email, type AS role, date_creation FROM utilisateurs ORDER BY id DESC")
            users = cursor.fetchall()
        connection.close()

        # Formatage des dates
        result = []
        for user in users:
            user = dict(user)
            if user.get('date_creation'):
                user['date_creation'] = user['date_creation'].isoformat()
            result.append(user)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Erreur serveur lors de la récupération.", "details": str(e)}), 500

@app.route('/api/utilisateurs/<int:user_id>', methods=['GET'])
def get_user(user_id):
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nom, email, type AS role, date_creation FROM utilisateurs WHERE id = %s", (user_id,))
            user = cursor.fetchone()
        connection.close()

        if not user:
            return jsonify({"error": f"Utilisateur avec l'ID {user_id} introuvable."}), 404

        user = dict(user)
        if user.get('date_creation'):
            user['date_creation'] = user['date_creation'].isoformat()

        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": "Erreur serveur lors de la consultation.", "details": str(e)}), 500

if __name__ == '__main__':
    # Lance le serveur Flask de développement sur le port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)