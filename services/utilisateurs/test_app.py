import unittest
from unittest.mock import patch, MagicMock
import datetime

# Import de l'application Flask
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import app

class TestUtilisateursService(unittest.TestCase):
    def setUp(self):
        # Configuration du client de test Flask
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.get_db_connection')
    def test_health_success(self, mock_get_db):
        """Test que la route /health répond OK lorsque la base de données est connectée."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        response = self.app.get('/health')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "UP", "database": "connected"})
        mock_cursor.execute.assert_called_once_with("SELECT 1")

    @patch('app.get_db_connection')
    def test_health_failure(self, mock_get_db):
        """Test que la route /health répond 500 lorsque la base de données est déconnectée."""
        mock_get_db.side_effect = Exception("DB Connection error")

        response = self.app.get('/health')
        
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json['status'], "DOWN")
        self.assertEqual(response.json['database'], "disconnected")

    @patch('app.get_db_connection')
    def test_list_users(self, mock_get_db):
        """Test la récupération de la liste des utilisateurs."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_cursor.fetchall.return_value = [
            {
                "id": 2,
                "nom": "Sira Dia",
                "email": "sira.dia@dit.sn",
                "role": "professeur",
                "date_creation": datetime.datetime(2026, 7, 10, 12, 5, 0)
            },
            {
                "id": 1,
                "nom": "Patrice Dione",
                "email": "patrice.dione@dit.sn",
                "role": "etudiant",
                "date_creation": datetime.datetime(2026, 7, 10, 12, 0, 0)
            }
        ]

        response = self.app.get('/api/utilisateurs')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]['nom'], "Sira Dia")
        self.assertEqual(response.json[0]['date_creation'], "2026-07-10T12:05:00")

    @patch('app.get_db_connection')
    def test_get_user_by_id_success(self, mock_get_db):
        """Test la récupération d'un utilisateur par son ID."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_cursor.fetchone.return_value = {
            "id": 1,
            "nom": "Patrice Dione",
            "email": "patrice.dione@dit.sn",
            "role": "etudiant",
            "date_creation": datetime.datetime(2026, 7, 10, 12, 0, 0)
        }

        response = self.app.get('/api/utilisateurs/1')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['nom'], "Patrice Dione")
        self.assertEqual(response.json['role'], "etudiant")

    @patch('app.get_db_connection')
    def test_get_user_by_id_not_found(self, mock_get_db):
        """Test la réponse 404 si l'utilisateur n'existe pas."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_cursor.fetchone.return_value = None

        response = self.app.get('/api/utilisateurs/999')
        
        self.assertEqual(response.status_code, 404)
        self.assertIn("introuvable", response.json['error'])

    @patch('app.get_db_connection')
    def test_create_user_success(self, mock_get_db):
        """Test la création réussie d'un utilisateur."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Sous PostgreSQL, l'INSERT ... RETURNING id renvoie l'id via un premier
        # fetchone(), puis un second fetchone() récupère la ligne complète.
        mock_cursor.fetchone.side_effect = [
            {"id": 3},
            {
                "id": 3,
                "nom": "Amina Diagne",
                "email": "amina.diagne@dit.sn",
                "role": "personnel",
                "date_creation": datetime.datetime(2026, 7, 10, 12, 10, 0)
            }
        ]

        response = self.app.post('/api/utilisateurs', json={
            "nom": "Amina Diagne",
            "email": "amina.diagne@dit.sn",
            "role": "personnel"
        })
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['id'], 3)
        self.assertEqual(response.json['nom'], "Amina Diagne")
        self.assertEqual(response.json['role'], "personnel")

    def test_create_user_missing_fields(self):
        """Test la validation des champs obligatoires lors de la création."""
        response = self.app.post('/api/utilisateurs', json={
            "nom": "Mamadou Ndiaye"
            # Manque email et role
        })
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("manquants", response.json['error'])

    def test_create_user_invalid_role(self):
        """Test le rejet d'un rôle invalide lors de la création."""
        response = self.app.post('/api/utilisateurs', json={
            "nom": "Halima Diallo",
            "email": "halima.diallo@dit.sn",
            "role": "Directrice"  # Rôle invalide
        })
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("invalide", response.json['error'])

if __name__ == '__main__':
    unittest.main()