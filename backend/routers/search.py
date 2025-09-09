from fastapi import APIRouter, Query
from typing import List, Optional, Dict, Any
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError
import os

router = APIRouter()

ELASTIC_HOST = os.getenv("ELASTIC_HOST", "localhost")
ELASTIC_PORT = os.getenv("ELASTIC_PORT", "9200")
INDEX_NAME = os.getenv("ELASTIC_INDEX", "organizations")
ELASTIC_URL = f"http://{ELASTIC_HOST}:{ELASTIC_PORT}"

es = Elasticsearch(ELASTIC_URL)


@router.get("/search")
def search(
    query: Optional[str] = Query(None, description="Texte à rechercher"),
    tags: Optional[List[str]] = Query(None, description="Filtrer par tags"),
    categories: Optional[List[str]] = Query(None, description="Filtrer par catégories"),
    lang: str = Query("fr", description="Langue des résultats"),
    limit: int = Query(50, description="Nombre maximal de résultats"),
) -> List[Dict[str, Any]]:

    should_clauses = []
    filter_clauses = [{"term": {"lang": lang}}]

    # Texte plein (multi-champs)
    if query:
        should_clauses.append({
            "multi_match": {
                "query": query,
                "fields": ["name^3", "description^2", "chapo"],
                "fuzziness": "AUTO"
            }
        })

    # Filtre par tags
    if tags:
        should_clauses.append({"terms": {"tags.keyword": tags}})

    # Si aucun critère (texte ni tags), on fait un match_all
    if not should_clauses:
        query_body = {"match_all": {}}
    else:
        query_body = {
            "bool": {
                "should": should_clauses,
                "filter": filter_clauses,
                "minimum_should_match": 1  # suffisant qu'un critère soit vrai
            }
        }

    es_query = {
        "size": limit,
        "query": query_body
    }

    try:
        response = es.search(index=f"{INDEX_NAME}_{lang}", body=es_query)
    except NotFoundError:
        return []

    hits = response.get("hits", {}).get("hits", [])
    results = []
    for h in hits:
        source = h["_source"]
        results.append({
            "_id": h["_id"],
            "name": source.get("name"),
            "chapo": source.get("chapo", ""),
            "description": source.get("description", ""),
            "url": source.get("slug", ""),
            "image": source.get("image"),
            "tags": source.get("tags", []),
            "lang": source.get("lang", lang),
            "score": h.get("_score")
        })

    return results
