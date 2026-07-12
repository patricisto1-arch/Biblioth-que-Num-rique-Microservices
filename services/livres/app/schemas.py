from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LivreBase(BaseModel):
    titre: str
    auteur: str
    isbn: str
    disponible: Optional[bool] = True


class LivreCreate(LivreBase):
    pass


class LivreUpdate(BaseModel):
    titre: Optional[str] = None
    auteur: Optional[str] = None
    isbn: Optional[str] = None
    disponible: Optional[bool] = None


class LivreOut(LivreBase):
    id: int
    date_ajout: Optional[datetime] = None

    class Config:
        from_attributes = True