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


router = APIRouter(prefix="/organizations", tags=["organizations"])

# Nom des indices Elastic par langue
INDEX_PREFIX = INDEX_NAME + "_"

# ------------------------------
# POST /organizations
# Crée une structure dans une langue spécifique
# ------------------------------
@router.post("/")
def create_organization(
    organization: Organization,
    request: Request
):
    # 1️⃣ Récupérer le user connecté depuis le cookie
    payload = get_current_user_from_cookie(request)
    owner_id = payload.get("user_id")
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
    org_dict["keywords"] = organization.keywords

    # 5️⃣ Insérer dans MongoDB
    result = db.organizations.insert_one(org_dict)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Impossible de créer la structure")

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
        "message": "Structure créée",
        "organization_id": organization.organization_id
    }

# ------------------------------
# GET /organizations?keyword=sport&lang=fr
# Récupère toutes les structure d'une langue, éventuellement filtrées par keyword
# ------------------------------
@router.get("/")
def get_organizations(keyword: Optional[str] = Query(None), lang: str = Query("fr")):
    query = {"lang": lang}
    if keyword:
        query["keywords"] = keyword
    organizations = []
    for organization in db.organizations.find(query):
        organization["_id"] = str(organization["_id"])
        organizations.append(organization)
    return organizations

# ------------------------------
# GET /organizations/{identifier}?lang=fr
# Récupère une structure spécifique dans une langue selon son id OU son slug
# ------------------------------
@router.get("/{identifier}")
def get_organization(identifier: str, lang: str = Query("fr")):
    # Recherche par organization_id
    organization = db.organizations.find_one({"organization_id": identifier, "lang": lang})
    # Si pas trouvé, recherche par slug
    if not organization:
        organization = db.organizations.find_one({"slug": identifier, "lang": lang})
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization non trouvée")

    # Enrichissement des keywords avec $lookup via aggregation
    pipeline = [
        {"$match": {"organization_id": organization["organization_id"], "lang": lang}},
        {"$lookup": {
            "from": "keywords",
            "let": {"codes": "$keywords", "lang": "$lang"},
            "pipeline": [
                {"$match": {
                    "$expr": {
                        "$and": [
                            {"$in": ["$code", "$$codes"]},
                            {"$eq": ["$lang", "$$lang"]}
                        ]
                    }
                }},
                {"$project": {
                    "_id": 0,
                    "code": 1,
                    "lang": 1,
                    "name": 1,
                    "category_code": 1,
                    "display_on_search_engine": 1
                }}
            ],
            "as": "keywords_details"
        }},
        {"$project": {
            "_id": 0,
            "organization_id": 1,
            "name": 1,
            "description": 1,
            "slug": 1,
            "lang": 1,
            "keywords": 1,
            "keywords_details": 1
        }}
    ]


    enriched = list(db.organizations.aggregate(pipeline))
    return enriched[0]  # retourne le document unique

# ------------------------------
# UPDATE /organizations/{organization_id}?lang=fr
# modifie une structure spécifique dans une langue
# ------------------------------
@router.patch("/{organization_id}")
def patch_organization(organization_id: str, lang: str = Query("fr"), data: dict = Body(...)):
    if "_id" in data:
        data.pop("_id")

    # 1️⃣ Mise à jour dans MongoDB
    result = db.organizations.update_one(
        {"organization_id": organization_id, "lang": lang},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Organization non trouvée")

    # 2️⃣ Sync avec ElasticSearch
    index_name = f"{INDEX_PREFIX}{lang}"
    elasticsearch.update(
        index=index_name,
        id=organization_id,
        doc={"doc": data},  # 🔑 update partiel
    )

    # 3️⃣ Mise à jour du résumé (OrganizationSummary) dans les Users
    fields_to_update = {}
    allowed_fields = ["name", "slug"]  # ceux qui existent dans OrganizationSummary
    for key in allowed_fields:
        if key in data:
            fields_to_update[f"organizations.$[elem].{key}"] = data[key]

    if fields_to_update:
        db.users.update_many(
            {"organizations.organization_id": organization_id},
            {"$set": fields_to_update},
            array_filters=[{"elem.organization_id": organization_id, "elem.lang": lang}]
        )

    return {"message": "Organization et résumés mis à jour"}

# ------------------------------
# DELETE /organizations/all
# ⚠️ Supprime toutes les organizations dans MongoDB + tous les index Elastic
# ------------------------------
@router.delete("/all")
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
# Supprime une structures spécifique dans une langue
# ------------------------------
@router.delete("/{organization_id}")
def delete_organization(organization_id: str, lang: str = Query("fr")):
    # 1️⃣ Supprimer dans MongoDB (organizations)
    result = db.organizations.delete_one({"organization_id": organization_id, "lang": lang})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Organization non trouvée")

    # 2️⃣ Supprimer dans ElasticSearch
    index_name = f"{INDEX_PREFIX}{lang}"
    try:
        elasticsearch.delete(index=index_name, id=organization_id)
    except NotFoundError:
        pass  # si le doc n'existe pas dans Elastic, on ignore

    # 3️⃣ Supprimer uniquement le summary correspondant à la langue
    db.users.update_many(
        {},  # tous les users
        {"$pull": {"organizations": {"organization_id": organization_id, "lang": lang}}}
    )

    return {"message": f"Organization ({lang}) et résumé supprimés"}
