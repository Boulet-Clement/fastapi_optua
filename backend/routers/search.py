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
    all_tags_required: bool = Query(False, description="Requiert tous les tags pour matcher"),
    lang: str = Query("fr", description="Langue des résultats"),
    limit: int = Query(50, description="Nombre maximal de résultats"),
) -> List[Dict[str, Any]]:

    # Clause de filtre commune (langue)
    filter_clauses = [{"term": {"lang": lang}}]

    if all_tags_required:
        # --- AND strict : tous les tags et le texte doivent matcher ---
        must_clauses = []

        if query:
            must_clauses.append({
                "multi_match": {
                    "query": query,
                    "fields": ["name^3", "description^2", "chapo"],
                    "fuzziness": "AUTO",
                    "boost": 2.0
                }
            })

        if tags:
            must_clauses.extend([{"term": {"tags.keyword": tag}} for tag in tags])

        # Construction finale
        query_body = {
            "bool": {
                "must": must_clauses,
                "filter": filter_clauses
            }
        }

    else:
        # --- OR : texte ou au moins un tag ---
        should_clauses = []

        if query:
            should_clauses.append({
                "multi_match": {
                    "query": query,
                    "fields": ["name^3", "description^2", "chapo"],
                    "fuzziness": "AUTO",
                    "boost": 2.0
                }
            })

        if tags:
            should_clauses.append({
                "bool": {
                    "should": [{"term": {"tags.keyword": tag}} for tag in tags],
                    "minimum_should_match": 1
                }
            })

        if not should_clauses:
            query_body = {"match_all": {}}
        else:
            query_body = {
                "bool": {
                    "should": should_clauses,
                    "filter": filter_clauses,
                    "minimum_should_match": 1
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
