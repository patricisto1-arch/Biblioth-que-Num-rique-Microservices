from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas


def create_livre(db: Session, livre: schemas.LivreCreate):
    db_livre = models.Livre(**livre.dict())
    db.add(db_livre)
    db.commit()
    db.refresh(db_livre)
    return db_livre


def get_livres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Livre).offset(skip).limit(limit).all()


def get_livre(db: Session, livre_id: int):
    return db.query(models.Livre).filter(models.Livre.id == livre_id).first()


def update_livre(db: Session, livre_id: int, livre: schemas.LivreUpdate):
    db_livre = get_livre(db, livre_id)
    if not db_livre:
        return None
    for key, value in livre.dict(exclude_unset=True).items():
        setattr(db_livre, key, value)
    db.commit()
    db.refresh(db_livre)
    return db_livre


def delete_livre(db: Session, livre_id: int):
    db_livre = get_livre(db, livre_id)
    if not db_livre:
        return None
    db.delete(db_livre)
    db.commit()
    return db_livre


def search_livres(db: Session, q: str):
    pattern = f"%{q}%"
    return db.query(models.Livre).filter(
        or_(
            models.Livre.titre.ilike(pattern),
            models.Livre.auteur.ilike(pattern),
            models.Livre.isbn.ilike(pattern),
        )
    ).all()