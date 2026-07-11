from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Service Livres - Bibliothèque Numérique")


@app.get("/")
def root():
    return {"service": "livres", "status": "ok"}


@app.post("/livres/", response_model=schemas.LivreOut)
def ajouter_livre(livre: schemas.LivreCreate, db: Session = Depends(get_db)):
    return crud.create_livre(db, livre)


@app.get("/livres/", response_model=List[schemas.LivreOut])
def lister_livres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_livres(db, skip, limit)


@app.get("/livres/search", response_model=List[schemas.LivreOut])
def rechercher_livres(q: str, db: Session = Depends(get_db)):
    return crud.search_livres(db, q)


@app.get("/livres/{livre_id}", response_model=schemas.LivreOut)
def obtenir_livre(livre_id: int, db: Session = Depends(get_db)):
    db_livre = crud.get_livre(db, livre_id)
    if not db_livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return db_livre


@app.put("/livres/{livre_id}", response_model=schemas.LivreOut)
def modifier_livre(livre_id: int, livre: schemas.LivreUpdate, db: Session = Depends(get_db)):
    db_livre = crud.update_livre(db, livre_id, livre)
    if not db_livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return db_livre


@app.delete("/livres/{livre_id}")
def supprimer_livre(livre_id: int, db: Session = Depends(get_db)):
    db_livre = crud.delete_livre(db, livre_id)
    if not db_livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return {"message": "Livre supprimé"}