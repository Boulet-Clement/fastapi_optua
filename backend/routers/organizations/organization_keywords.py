from fastapi import APIRouter, HTTPException, Body
from core.db import db
from models.keyword.org_keyword_action import OrgKeywordAction

router = APIRouter(prefix="/organization", tags=["organization_keywords"])

# ------------------------------
# POST /organization/{slug}/keywords
# Ajoute un mot-clé à une organization via son slug
# ------------------------------
@router.post("/{slug}/keywords")
def add_keyword_by_slug(
    slug: str,
    payload: OrgKeywordAction = Body(...)
):
    print(slug)
    print(payload)
    org = db.organizations.find_one({"slug": slug, "lang": payload.lang})
    print(org)
    if not org:
        raise HTTPException(404, detail="Organization non trouvée")

    result = db.organizations.update_one(
        {"slug": slug, "lang": payload.lang},
        {"$addToSet": {"keywords": payload.keyword_code}}
    )

    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")

    return {"message": f"Keyword '{payload.keyword_code}' ajouté", "organization_id": org["organization_id"]}

# ------------------------------
# DELETE /organization/{slug}/keywords
# Retire un mot-clé à une organization via son slug
# ------------------------------
@router.delete("/{slug}/keywords")
def remove_keyword_by_slug(
    slug: str,
    payload: OrgKeywordAction = Body(...)
):
    org = db.organizations.find_one({"slug": slug, "lang": payload.lang})
    if not org:
        raise HTTPException(404, detail="Organization non trouvée")

    result = db.organizations.update_one(
        {"slug": slug, "lang": payload.lang},
        {"$pull": {"keywords": payload.keyword_code}}
    )

    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")

    return {"message": f"Keyword '{payload.keyword_code}' retiré"}

