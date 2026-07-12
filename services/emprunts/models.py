from datetime import datetime

from extensions import db


class Emprunt(db.Model):
    __tablename__ = "emprunts"

    id = db.Column(db.Integer, primary_key=True)
    utilisateur_id = db.Column(db.Integer, nullable=False, index=True)
    livre_id = db.Column(db.Integer, nullable=False, index=True)
    date_emprunt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    date_retour = db.Column(db.DateTime, nullable=True)
    statut = db.Column(db.String(20), default="en_cours", nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "utilisateur_id": self.utilisateur_id,
            "livre_id": self.livre_id,
            "date_emprunt": self.date_emprunt.isoformat() if self.date_emprunt else None,
            "date_retour": self.date_retour.isoformat() if self.date_retour else None,
            "statut": self.statut,
        }