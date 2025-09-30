from typing import List
from fastapi import APIRouter, Query, HTTPException
from core.db import db
from models.keyword.keyword import Keyword

router = APIRouter(prefix="/keywords", tags=["keywords"])

@router.get("/", response_model=List[Keyword])
def get_keywords(
    lang: str = Query("fr", description="Langue des keywords (fr, en, etc.)")
):
    """
    Récupère tous les keywords d'une langue donnée.
    """
    query = {"lang": lang}
    keywords = list(db.keywords.find(query, {"_id": 0}))  # on exclut _id
    
    if not keywords:
        raise HTTPException(status_code=404, detail=f"Aucun keyword trouvée pour la langue '{lang}'")

    return keywords

@router.delete("/all")
def delete_all_keywords():
    # 1. Supprimer toutes les organizations dans MongoDB
    db.keywords.delete_many({})

    return {"message": "Tous les mots clés ont été supprimés"}
