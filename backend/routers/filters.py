from fastapi import APIRouter, Query
from core.db import db
from typing import List, Dict, Any

router = APIRouter()

@router.get("/filters")
def get_filters(lang: str = Query("fr", description="Langue des catégories et tags")) -> List[Dict[str, Any]]:
    """
    Récupère toutes les catégories et leurs tags pour la langue donnée.
    Résultat prêt pour affichage des filtres côté front.
    """
    pipeline = [
        {"$match": {"lang": lang, "display_on_search_engine": True}}, # uniquement les tags visibles
        {"$lookup": {
            "from": "categories",
            "localField": "category_code",
            "foreignField": "code",
            "as": "category"
        }},
        {"$unwind": "$category"},
        {"$group": {
            "_id": "$category.code",
            "category_name": {"$first": "$category.name"},
            "tags": {"$push": {"code": "$code", "name": "$name"}}
        }},
        {"$sort": {"category_name": 1}}
    ]

    filters = list(db.tags.aggregate(pipeline))
    return filters
