# services/elasticsearch_service.py
from core.elasticsearch import elasticsearch, INDEX_NAME
from core.db import db

def delete_organization(lang: str, slug: str):
    """
    Supprime une organisation spécifique de l'index Elasticsearch
    selon son slug et sa langue.
    """  
    index_name = f"{INDEX_NAME}_{lang}"

    try:
        elasticsearch.delete(index=index_name, id=slug, ignore=[404])
        print(f"🧹 Organisation '{slug}' supprimée de l'index '{index_name}'")
        return {"deleted": True, "index": index_name, "slug": slug}
    except Exception as e:
        print(f"⚠️ Erreur lors de la suppression de '{slug}' dans '{index_name}': {e}")
        return {"deleted": False, "error": str(e), "index": index_name, "slug": slug}
