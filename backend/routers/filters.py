from fastapi import APIRouter, Query
from core.db import db
from typing import List, Dict, Any

router = APIRouter()

@router.get("/filters")
def get_filters(lang: str = Query("fr", description="Langue des catégories et keywords")) -> List[Dict[str, Any]]:
    """
    Récupère toutes les catégories et leurs keywords pour la langue donnée.
    Résultat prêt pour affichage des filtres côté front.
    """
    pipeline = [
        {"$match": {"lang": lang, "display_on_search_engine": True}}, 
        {"$lookup": {
            "from": "categories",
            "let": {"category_code": "$category_code"},
            "pipeline": [
                {"$match": {"$expr": {"$and": [{"$eq": ["$code", "$$category_code"]}, {"$eq": ["$lang", lang]}]}}}
            ],
            "as": "category"
        }},
        {"$unwind": "$category"},
        {"$group": {
            "_id": "$category.code",
            "category_name": {"$first": "$category.name"},
            "keywords": {"$push": {"code": "$code", "name": "$name"}}
        }},
        {"$sort": {"category_name": 1}},
        # renommer _id en code
        {"$project": {
            "code": "$_id",
            "category_name": 1,
            "keywords": 1,
            "_id": 0
        }},
    ]


    filters = list(db.keywords.aggregate(pipeline))
    return filters
