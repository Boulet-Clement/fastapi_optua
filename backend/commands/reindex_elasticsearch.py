from core.db import db
from core.elasticsearch import elasticsearch, INDEX_NAME

def reindex_organizations():
    organizations = db.organizations.find()
    for org in organizations:
        doc_id = str(org["_id"])  # sauvegarder l'id MongoDB pour Elasticsearch
        del org["_id"]             # enlever _id du document
        elasticsearch.index(index=INDEX_NAME, id=doc_id, document=org)
    print("Reindexation terminée !")

if __name__ == "__main__":
    reindex_organizations()
