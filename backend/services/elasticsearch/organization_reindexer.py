# services/elasticsearch_service.py
from core.elasticsearch import elasticsearch, INDEX_NAME
from core.db import db

def reindex_organization(org: dict):
    """
    Réindexe une organisation unique dans ElasticSearch avec ses keywords_details
    (keywords_details est stocké en tant que 'nested' dans le mapping).
    """
    lang = org.get("lang")
    if not lang:
        raise ValueError("Langue manquante dans l'organisation")

    index_name = f"{INDEX_NAME}_{lang}"
    doc_id = org.get("slug") or org.get("organization_id")

    # Nettoyer l'objet Mongo
    org_doc = org.copy()
    org_doc.pop("_id", None)

    # --- Construire keywords_details dans l'ordre des codes de org_doc["keywords"]
    codes = org_doc.get("keywords", []) or []
    keywords_details = []

    if codes:
        cursor = db.keywords.find(
            {"code": {"$in": codes}, "lang": lang},
            {"_id": 0, "code": 1, "name": 1, "lang": 1, "category_code": 1, "display_on_search_engine": 1}
        )
        kw_list = list(cursor)
        # map code -> doc pour retrouver rapidement
        code_map = {k["code"]: k for k in kw_list}

        for code in codes:
            k = code_map.get(code)
            if not k:
                continue
            # choisir les champs à exposer dans ES (ici exemple complet)
            keywords_details.append({
                "code": k.get("code"),
                "lang": k.get("lang"),
                "name": k.get("name"),
                "category_code": k.get("category_code")
            })

    org_doc["keywords_details"] = keywords_details

    # --- Créer l'index avec mapping 'nested' si non existant
    if not elasticsearch.indices.exists(index=index_name):
        mapping = {
            "mappings": {
                "_source": { "enabled": True },
                "properties": {
                    "keywords_details": {
                        "type": "nested",
                        "properties": {
                            "code": {"type": "keyword"},
                            "lang": {"type": "keyword"},
                            "name": {"type": "text", "fields": {"keyword": {"type":"keyword"}}},
                            "category_code": {"type":"keyword"},
                        }
                    },
                    # tu peux ajouter d'autres mappings pour d'autres champs si besoin
                }
            }
        }
        elasticsearch.indices.create(index=index_name, body=mapping)
    else:
        # Vérifier rapidement le mapping existant : si keywords_details existe et n'est pas nested -> notifier
        try:
            existing_map = elasticsearch.indices.get_mapping(index=index_name)
            props = existing_map[index_name]["mappings"].get("properties", {})
            kd = props.get("keywords_details")
            if kd and kd.get("type") != "nested":
                # Impossible de changer le type d'un champ d'un index existant.
                # Il faudra recréer l'index (ou utiliser un nouvel index + alias) et reindexer.
                print(f"[WARNING] Index {index_name} existe et keywords_details n'est pas 'nested' (type={kd.get('type')}). Pensez à recréer/reindexer.")
        except Exception as e:
            print("Impossible de vérifier le mapping existant :", e)

    # --- Indexer le document
    elasticsearch.index(index=index_name, id=doc_id, document=org_doc)
    return {"message": f"Organisation '{doc_id}' réindexée dans {index_name}"}
