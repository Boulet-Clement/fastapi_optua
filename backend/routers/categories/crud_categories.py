from typing import List
from fastapi import APIRouter, Query, HTTPException
from core.db import db
from models.category import Category

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[Category])
def get_categories(
    lang: str = Query("fr", description="Langue des categories (fr, en, etc.)")
):
    """
    Récupère toutes les categories d'une langue donnée.
    """
    query = {"lang": lang}
    categories = list(db.categories.find(query, {"_id": 0}))  # on exclut _id
    
    if not categories:
        raise HTTPException(status_code=404, detail=f"Aucune categorie trouvée pour la langue '{lang}'")

    return categories

@router.delete("/all")
def delete_all_categories():
    # 1. Supprimer toutes les organizations dans MongoDB
    db.categories.delete_many({})

    return {"message": "Toutes les catégories ont été supprimés"}
