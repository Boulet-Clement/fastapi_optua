# services/elasticsearch_service.py
from core.elasticsearch import elasticsearch, INDEX_NAME

def reindex_organization(org: dict):
    """
    Réindexe une organisation unique dans ElasticSearch
    """
    lang = org.get("lang")
    if not lang:
        raise ValueError("Langue manquante dans l'organisation")

    index_name = f"{INDEX_NAME}_{lang}"
    doc_id = org["slug"]

    # Nettoyer l'objet Mongo
    org_doc = org.copy()
    org_doc.pop("_id", None)

    # Optionnel : vérifier que l'index existe (sinon le créer)
    if not elasticsearch.indices.exists(index=index_name):
        elasticsearch.options(ignore_status=[400]).indices.create(index=index_name)

    # Réindexation
    elasticsearch.index(index=index_name, id=doc_id, document=org_doc)

    return {"message": f"Organisation '{doc_id}' réindexée dans {index_name}"}
