from bson import ObjectId
from core.auth_utils import get_current_user_from_cookie
from core.db import db
from core.elasticsearch import elasticsearch, INDEX_NAME
from elasticsearch import NotFoundError
from fastapi import APIRouter, HTTPException, Query, Body, Request, Depends
from models.organization.organization import Organization
from models.user.user import User
from services.slug_service import generate_unique_slug
from typing import Optional
import uuid


router = APIRouter()

# Nom des indices Elastic par langue
INDEX_PREFIX = INDEX_NAME + "_"

# ------------------------------
# POST /organizations
# Crée une organisation dans une langue spécifique
# ------------------------------
@router.post("/organizations")
def create_organization(
    organization: Organization,
    request: Request
):
    # 1️⃣ Récupérer le user connecté depuis le cookie
    payload = get_current_user_from_cookie(request)
    owner_id = payload.get("sub")
    if not owner_id:
        raise HTTPException(status_code=401, detail="Utilisateur non identifié")

    # 2️⃣ Assigner owner_id et générer organization_id si absent
    organization.owner_id = owner_id
    if not organization.organization_id:
        organization.organization_id = str(uuid.uuid4())

    # 3️⃣ Générer un slug unique
    organization.slug = generate_unique_slug(organization.name, organization.lang)

    # 4️⃣ Préparer le dict pour Mongo
    org_dict = organization.dict()
    org_dict["tags"] = organization.tags

    # 5️⃣ Insérer dans MongoDB
    result = db.organizations.insert_one(org_dict)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Impossible de créer l'organisation")

    # 6️⃣ Indexer dans Elastic
    index_name = f"{INDEX_PREFIX}{organization.lang.value.lower()}"
    es_doc = org_dict.copy()
    es_doc.pop("_id", None)
    elasticsearch.index(
        index=index_name,
        id=organization.organization_id,
        document=es_doc
    )

    # 7️⃣ Ajouter résumé dans User.organizations
    summary = {
        "organization_id": organization.organization_id,
        "name": organization.name,
        "slug": organization.slug,
        "lang": organization.lang
    }
    db.users.update_one(
        {"user_id": owner_id},
        {"$push": {"organizations": summary}}
    )

    return {
        "message": "Organisation créée",
        "organization": org_dict
    }

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
