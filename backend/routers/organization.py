from fastapi import APIRouter, HTTPException
from core.db import db
from models.organization import Organization
from bson import ObjectId

router = APIRouter()

# POST /organizations - créer une organisation
@router.post("/organizations")
def create_organization(org: Organization):
    org_dict = org.dict()
    result = db.organizations.insert_one(org_dict)
    if result.inserted_id:
        return {"message": "Organization créée", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Impossible de créer l'organisation")

# GET /organizations - récupérer toutes les organisations
@router.get("/organizations")
def get_organizations():
    orgs = []
    for org in db.organizations.find():
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
