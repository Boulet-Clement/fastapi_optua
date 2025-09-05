from core.db import db
from core.elasticsearch import elasticsearch, INDEX_NAME

def reindex_organizations():
    # Lister les langues présentes
    langs = db.organizations.distinct("lang")

    for lang in langs:
        index_name = f"{INDEX_NAME}_{lang}"

        # ⚠️ Supprime complètement l’index pour repartir propre
        if elasticsearch.indices.exists(index=index_name):
            elasticsearch.indices.delete(index=index_name)

        # Recréer l’index (optionnel : tu peux y mettre un mapping)
        #elasticsearch.indices.create(index=index_name, ignore=400)
        elasticsearch.options(ignore_status=[400]).indices.create(index=index_name)


        # Réindexer toutes les orgs de cette langue
        organizations = db.organizations.find({"lang": lang})
        for org in organizations:
            doc_id = org["organization_id"]
            org_doc = org.copy()
            org_doc.pop("_id", None)
            elasticsearch.index(index=index_name, id=doc_id, document=org_doc)

    print("Réindexation terminée 🚀")

if __name__ == "__main__":
    reindex_organizations()
