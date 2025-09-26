from fastapi import APIRouter, HTTPException, Body
from core.db import db
from models.organization.organization_edit_summary import OrganizationEditSummary
from services.slug_service import generate_unique_slug

router = APIRouter(prefix="/organization", tags=["organization_summary"])

@router.patch("/{slug}/summary")
def update_summary_by_slug(
    slug: str,
    payload: OrganizationEditSummary = Body(...)
):
    # Vérifier que l'organisation existe
    org = db.organizations.find_one({"slug": slug, "lang": payload.lang})
    print(org)
    if not org:
        raise HTTPException(404, detail="Organization non trouvée")

    # Construire les champs à mettre à jour
    update_fields = {
        field: value
        for field, value in payload.dict(exclude={"lang"}).items()
        if value is not None
    }
    print(update_fields)

    # Si le nom est modifié -> régénérer un slug unique
    if "name" in update_fields:
        new_slug = generate_unique_slug(update_fields["name"], payload.lang)
        update_fields["slug"] = new_slug

    if not update_fields:
        raise HTTPException(400, detail="Aucun champ à mettre à jour")

    result = db.organizations.update_one(
        {"slug": slug, "lang": payload.lang},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")
    
    db.users.update_many(
        {"organizations.organization_id": org["organization_id"], "organizations.lang": payload.lang},
        {"$set": {
            "organizations.$.name": update_fields.get("name", org["name"]),
            "organizations.$.slug": update_fields.get("slug", org.get("slug")),
        }}
    )

    return {
        "message": f"Organisation '{slug}' mise à jour",
        "updated_fields": list(update_fields.keys()),
        "new_slug": update_fields.get("slug", slug)  # retourner le nouveau slug si changé
    }
