from core.db import db
from core.elasticsearch import elasticsearch, INDEX_NAME
from services.elasticsearch.organization_reindexer import reindex_organization  # ✅ on importe le service

def reindex_organizations():
    # Lister les langues présentes
    langs = db.organizations.distinct("lang")

    for lang in langs:
        index_name = f"{INDEX_NAME}_{lang}"

        # ⚠️ Supprimer l’index existant pour repartir propre
        if elasticsearch.indices.exists(index=index_name):
            elasticsearch.indices.delete(index=index_name)

        # Recréer l’index (avec mapping ou non)
        #elasticsearch.options(ignore_status=[400]).indices.create(index=index_name)

        # Récupérer toutes les organisations de cette langue
        organizations = db.organizations.find({"lang": lang})

        for org in organizations:
            # ✅ Utilisation du service centralisé
            reindex_organization(org)

    print("Réindexation terminée 🚀")

if __name__ == "__main__":
    reindex_organizations()
