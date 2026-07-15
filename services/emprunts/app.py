import os
import time
from datetime import datetime

import requests
from flask import Flask, jsonify, request
from sqlalchemy.exc import OperationalError

from config import Config
from extensions import db
from models import Emprunt


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        for tentative in range(10):
            try:
                db.create_all()
                break
            except OperationalError:
                app.logger.warning(
                    "Base de données indisponible (tentative %s/10), nouvel essai dans 3s...",
                    tentative + 1,
                )
                time.sleep(3)

    register_routes(app)
    return app


def register_routes(app):
    @app.get("/health")
    def health():
        return jsonify(status="ok", service="emprunts"), 200

    @app.get("/emprunts")
    def liste_emprunts():
        statut = request.args.get("statut")
        query = Emprunt.query
        if statut:
            query = query.filter_by(statut=statut)
        emprunts = query.order_by(Emprunt.date_emprunt.desc()).all()
        return jsonify([e.to_dict() for e in emprunts]), 200

    @app.get("/emprunts/<int:emprunt_id>")
    def detail_emprunt(emprunt_id):
        emprunt = Emprunt.query.get(emprunt_id)
        if not emprunt:
            return jsonify(erreur="Emprunt introuvable"), 404
        return jsonify(emprunt.to_dict()), 200

    @app.get("/emprunts/utilisateur/<int:utilisateur_id>")
    def historique_utilisateur(utilisateur_id):
        emprunts = (
            Emprunt.query.filter_by(utilisateur_id=utilisateur_id)
            .order_by(Emprunt.date_emprunt.desc())
            .all()
        )
        return jsonify([e.to_dict() for e in emprunts]), 200

    @app.get("/emprunts/livre/<int:livre_id>")
    def historique_livre(livre_id):
        emprunts = (
            Emprunt.query.filter_by(livre_id=livre_id)
            .order_by(Emprunt.date_emprunt.desc())
            .all()
        )
        return jsonify([e.to_dict() for e in emprunts]), 200

    @app.post("/emprunts")
    def emprunter_livre():
        data = request.get_json(silent=True) or {}
        livre_id = data.get("livre_id")
        utilisateur_id = data.get("utilisateur_id")

        if not livre_id or not utilisateur_id:
            return jsonify(erreur="livre_id et utilisateur_id sont obligatoires"), 400

        try:
            resp_user = requests.get(
                f"{app.config['UTILISATEURS_SERVICE_URL']}/api/utilisateurs/{utilisateur_id}",
                timeout=5,
            )
        except requests.RequestException:
            return jsonify(erreur="Service Utilisateurs indisponible"), 503

        if resp_user.status_code == 404:
            return jsonify(erreur="Utilisateur introuvable"), 404
        if resp_user.status_code != 200:
            return jsonify(erreur="Erreur du service Utilisateurs"), 502

        try:
            resp_livre = requests.get(
                f"{app.config['LIVRES_SERVICE_URL']}/livres/{livre_id}", timeout=5
            )
        except requests.RequestException:
            return jsonify(erreur="Service Livres indisponible"), 503

        if resp_livre.status_code == 404:
            return jsonify(erreur="Livre introuvable"), 404
        if resp_livre.status_code != 200:
            return jsonify(erreur="Erreur du service Livres"), 502

        livre = resp_livre.json()
        if livre.get("disponible") is False:
            return jsonify(erreur="Ce livre n'est pas disponible actuellement"), 409

        deja_emprunte = Emprunt.query.filter_by(livre_id=livre_id, statut="en_cours").first()
        if deja_emprunte:
            return jsonify(erreur="Ce livre est déjà emprunté"), 409

        nouvel_emprunt = Emprunt(
            livre_id=livre_id,
            utilisateur_id=utilisateur_id,
            statut="en_cours",
        )
        db.session.add(nouvel_emprunt)
        db.session.commit()

        try:
            requests.patch(
                f"{app.config['LIVRES_SERVICE_URL']}/livres/{livre_id}/disponibilite",
                params={"disponible": False},
                timeout=5,
            )
        except requests.RequestException:
            app.logger.warning(
                "Emprunt %s créé mais impossible de notifier le service Livres",
                nouvel_emprunt.id,
            )

        return jsonify(nouvel_emprunt.to_dict()), 201

    @app.put("/emprunts/<int:emprunt_id>/retour")
    def retourner_livre(emprunt_id):
        emprunt = Emprunt.query.get(emprunt_id)
        if not emprunt:
            return jsonify(erreur="Emprunt introuvable"), 404
        if emprunt.statut == "retourne":
            return jsonify(erreur="Cet emprunt est déjà clôturé"), 409

        emprunt.statut = "retourne"
        emprunt.date_retour = datetime.utcnow()
        db.session.commit()

        try:
            requests.patch(
                f"{app.config['LIVRES_SERVICE_URL']}/livres/{emprunt.livre_id}/disponibilite",
                params={"disponible": True},
                timeout=5,
            )
        except requests.RequestException:
            app.logger.warning(
                "Retour enregistré mais impossible de notifier le service Livres pour l'emprunt %s",
                emprunt.id,
            )

        return jsonify(emprunt.to_dict()), 200


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8003)), debug=True)
