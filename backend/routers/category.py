from typing import List
from fastapi import APIRouter, Query, HTTPException
from core.db import db
from models.category import Category

router = APIRouter()

@router.get("/categories", response_model=List[Category])
def get_categories(
    lang: str = Query("fr", description="Langue des catégories (fr, en, etc.)")
):
    """
    Récupère toutes les catégories d'une langue donnée.
    """
    query = {"lang": lang}
    categories = list(db.categories.find(query, {"_id": 0}))  # on exclut _id
    
    if not categories:
        raise HTTPException(status_code=404, detail=f"Aucune catégorie trouvée pour la langue '{lang}'")

    return categories
