from fastapi import APIRouter, HTTPException, Query
from core.db import db
from models.organization import Organization, TagEnum
from bson import ObjectId
from typing import Optional
from core.elasticsearch import elasticsearch, INDEX_NAME

router = APIRouter()

# POST /organizations
@router.post("/organizations")
def create_organization(org: Organization):
    org_dict = org.dict()
    # Convertir les tags en string pour MongoDB
    org_dict["tags"] = [tag.value for tag in org.tags]
    result = db.organizations.insert_one(org_dict)
    if result.inserted_id:
        elasticsearch.index(index=INDEX_NAME, id=str(result.inserted_id), document=org_dict)
        return {"message": "Organization créée", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Impossible de créer l'organisation")

# GET /organizations?tag=sport
@router.get("/organizations")
def get_organizations(tag: Optional[TagEnum] = Query(None)):
    query = {}
    if tag:
        query["tags"] = tag.value  # filtre par tag
    orgs = []
    for org in db.organizations.find(query):
        org["_id"] = str(org["_id"])
        orgs.append(org)
    return orgs

# GET /organizations/{id} - récupérer une organisation par id
@router.get("/organizations/{id}")
def get_organization(id: str):
    org = db.organizations.find_one({"_id": ObjectId(id)})
    if org:
        org["_id"] = str(org["_id"])
        return org
    raise HTTPException(status_code=404, detail="Organization non trouvée")

# DELETE /organizations/{id} - supprimer une organisation
@router.delete("/organizations/{id}")
def delete_organization(id: str):
    result = db.organizations.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Organization supprimée"}
    raise HTTPException(status_code=404, detail="Organization non trouvée")
