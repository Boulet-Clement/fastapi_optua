from typing import List
from fastapi import APIRouter, Query, HTTPException
from core.db import db
from models.tag import Tag

router = APIRouter()

@router.get("/tags", response_model=List[Tag])
def get_tags(
    lang: str = Query("fr", description="Langue des tags (fr, en, etc.)")
):
    """
    Récupère tous les tags d'une langue donnée.
    """
    query = {"lang": lang}
    tags = list(db.tags.find(query, {"_id": 0}))  # on exclut _id
    
    if not tags:
        raise HTTPException(status_code=404, detail=f"Aucun tag trouvée pour la langue '{lang}'")

    return tags
