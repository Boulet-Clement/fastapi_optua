from fastapi import APIRouter, HTTPException, Body
from core.db import db
from models.organization.organization_edit_summary import OrganizationEditSummary

router = APIRouter(prefix="/organization", tags=["organization_summary"])

@router.patch("/{slug}/summary")
def update_summary_by_slug(
    slug: str,
    payload: OrganizationEditSummary = Body(...)
):
    # Vérifier que l'orga existe
    org = db.organizations.find_one({"slug": slug, "lang": payload.lang})
    if not org:
        raise HTTPException(404, detail="Organization non trouvée")

    # Construire l'objet update seulement avec les champs présents
    update_fields = {
        field: value
        for field, value in payload.dict(exclude={"lang"}).items()
        if value is not None
    }

    if not update_fields:
        raise HTTPException(400, detail="Aucun champ à mettre à jour")

    result = db.organizations.update_one(
        {"slug": slug, "lang": payload.lang},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")

    return {
        "message": f"Organisation '{slug}' mise à jour",
        "updated_fields": list(update_fields.keys())
    }
