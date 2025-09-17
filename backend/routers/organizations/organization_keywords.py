from fastapi import APIRouter, HTTPException, Body
from core.db import db
from models.keyword.org_keyword_action import OrgKeywordAction

router = APIRouter(prefix="/organization", tags=["organization_keywords"])

@router.post("/keywords")
def add_keyword(payload: OrgKeywordAction = Body(...)):
    """Ajoute un mot-clé à une organization (évite les doublons)"""
    result = db.organizations.update_one(
        {"organization_id": payload.organization_id, "lang": payload.lang},
        {"$addToSet": {"keywords": payload.keyword_code}}  # $addToSet empêche les doublons
    )
    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")
    return {"message": f"Keyword '{payload.keyword_code}' ajouté"}

@router.delete("/keywords")
def remove_keyword(payload: OrgKeywordAction = Body(...)):
    print(payload)
    """Retire un mot-clé d’une organization"""
    result = db.organizations.update_one(
        {"organization_id": payload.organization_id, "lang": payload.lang},
        {"$pull": {"keywords": payload.keyword_code}}  # $pull supprime si présent
    )
    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")
    return {"message": f"Keyword '{payload.keyword_code}' retiré"}
