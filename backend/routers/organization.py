from fastapi import APIRouter, HTTPException, Query
from core.db import db
from models.organization import Organization
from core.elasticsearch import elasticsearch, INDEX_NAME
from bson import ObjectId
from typing import Optional
from fastapi import Body
from elasticsearch import NotFoundError
from services.slug_service import generate_unique_slug
import uuid


router = APIRouter()

# Nom des indices Elastic par langue
INDEX_PREFIX = INDEX_NAME + "_"

# ------------------------------
# POST /organizations
# Crée une organisation dans une langue spécifique
# ------------------------------
@router.post("/organizations")
def create_organization(organization: Organization):
    organization_dict = organization.dict()

    organization_dict["slug"] = generate_unique_slug(organization.name, organization.lang)
    organization_dict["tags"] = organization.tags    
    organization_dict["organization_id"] = str(uuid.uuid4())

    result = db.organizations.insert_one(organization_dict)
    if result.inserted_id:
        # Indexation Elastic selon la langue
        index_name = f"{INDEX_PREFIX}{organization.lang.value.lower()}"
        es_doc = organization_dict.copy()
        es_doc.pop("_id", None)  # ne jamais envoyer _id à Elastic

        elasticsearch.index(
            index=index_name,
            id=organization_dict["organization_id"],  # 🔑 identifiant commun
            document=es_doc
        )

        return {
            "message": "Organization créée",
            "organization_id": organization_dict["organization_id"]
        }
    else:
        raise HTTPException(status_code=500, detail="Impossible de créer l'organisation")

# ------------------------------
# GET /organizations?tag=sport&lang=fr
# Récupère toutes les organisations d'une langue, éventuellement filtrées par tag
# ------------------------------
@router.get("/organizations")
def get_organizations(tag: Optional[str] = Query(None), lang: str = Query("fr")):
    query = {"lang": lang}
    if tag:
        query["tags"] = tag
    organizations = []
    for organization in db.organizations.find(query):
        organization["_id"] = str(organization["_id"])
        organizations.append(organization)
    return organizations

# ------------------------------
# GET /organizations/{organization_id}?lang=fr
# Récupère une organisation spécifique dans une langue
# ------------------------------
@router.get("/organizations/{organization_id}")
def get_organization(organization_id: str, lang: str = Query("fr")):
    organization = db.organizations.find_one({"organization_id": organization_id, "lang": lang})
    if organization:
        organization["_id"] = str(organization["_id"])
        return organization
    raise HTTPException(status_code=404, detail="Organization non trouvée")

# ------------------------------
# UPDATE /organizations/{organization_id}?lang=fr
# modifie une organisation spécifique dans une langue
# ------------------------------
@router.patch("/organizations/{organization_id}")
def patch_organization(organization_id: str, lang: str = Query("fr"), data: dict = Body(...)):
    if "_id" in data:
        data.pop("_id")

    result = db.organizations.update_one(
        {"organization_id": organization_id, "lang": lang},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Organization non trouvée")

    # Sync avec Elastic
    index_name = f"{INDEX_PREFIX}{lang}"
    elasticsearch.update(
        index=index_name,
        id=organization_id,
        doc={"doc": data},  # 🔑 update partiel
    )

    return {"message": "Organization mise à jour"}

# ------------------------------
# DELETE /organizations/all
# ⚠️ Supprime toutes les organizations dans MongoDB + tous les index Elastic
# ------------------------------
@router.delete("/organizations/all")
def delete_all_organizations():
    # 1. Supprimer toutes les organizations dans MongoDB
    db.organizations.delete_many({})

    # 2. Supprimer tous les index Elastic correspondant au préfixe
    try:
        # récupère tous les index existants
        all_indices = elasticsearch.indices.get(index="*")
        for index_name in all_indices.keys():
            if index_name.lower().startswith(INDEX_PREFIX.lower()):
                elasticsearch.indices.delete(index=index_name, ignore=[400, 404])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression des index Elastic: {str(e)}")

    return {"message": "Toutes les organizations et index Elastic ont été supprimés"}

# ------------------------------
# DELETE /organizations/{organization_id}?lang=fr
# Supprime une organisation spécifique dans une langue
# ------------------------------
@router.delete("/organizations/{organization_id}")
def delete_organization(organization_id: str, lang: str = Query("fr")):
    result = db.organizations.delete_one({"organization_id": organization_id, "lang": lang})
    if result.deleted_count == 1:
        index_name = f"{INDEX_PREFIX}{lang}"
        try:
            elasticsearch.delete(index=index_name, id=organization_id)
        except NotFoundError:
            pass  # si le doc n'existe pas dans Elastic, on ignore
        return {"message": "Organization supprimée"}
    raise HTTPException(status_code=404, detail="Organization non trouvée")
