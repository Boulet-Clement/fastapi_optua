import bleach
from fastapi import APIRouter, HTTPException, Body
from core.db import db
from models.organization.organization_edit_summary import OrganizationEditSummary
from services.slug_service import generate_unique_slug
from services.elasticsearch.organization_reindexer import reindex_organization
from services.elasticsearch.organization_deleter import delete_organization


router = APIRouter(prefix="/organization", tags=["organization_summary"])

ALLOWED_TAGS = [
    "p", "b", "i", "em", "strong", "u",
    "ul", "ol", "li", "h1", "h2", "h3",
    "blockquote", "br", "span"
]

ALLOWED_PROTOCOLS = ["http", "https", "mailto"]

@router.patch("/{slug}/summary")
def update_summary_by_slug(
    slug: str,
    payload: OrganizationEditSummary = Body(...)
):
    # Vérifier que l'organisation existe
    org = db.organizations.find_one({"slug": slug, "lang": payload.lang})
    if not org:
        raise HTTPException(404, detail="Organization non trouvée")

    # 🔒 Sanitize description
    if payload.description:
        payload.description = bleach.clean(
            payload.description,
            tags=ALLOWED_TAGS,
            protocols=ALLOWED_PROTOCOLS,
            strip=True
        )

    # Construire les champs à mettre à jour
    update_fields = {
        field: value
        for field, value in payload.dict(exclude={"lang"}).items()
        if value is not None
    }

    # Si le nom est modifié -> régénérer un slug unique
    if "name" in update_fields:
        new_slug = generate_unique_slug(update_fields["name"], payload.lang)
        update_fields["slug"] = new_slug

    if not update_fields:
        raise HTTPException(400, detail="Aucun champ à mettre à jour")

    # Mise à jour
    result = db.organizations.update_one(
        {"slug": slug, "lang": payload.lang},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(404, detail="Organization non trouvée")
    
    # Mise à jour dans les utilisateurs si nécessaire
    db.users.update_many(
        {"organizations.organization_id": org["organization_id"], "organizations.lang": payload.lang},
        {"$set": {
            "organizations.$.name": update_fields.get("name", org["name"]),
            "organizations.$.slug": update_fields.get("slug", org.get("slug")),
        }}
    )

    # Recharger l'organisation mise à jour pour la renvoyer
    updated_slug = update_fields.get("slug", slug)
    updated_org = db.organizations.find_one(
        {"slug": updated_slug, "lang": payload.lang},
        {
            "_id": 0
        }
    )

    delete_organization(payload.lang, slug)
    reindex_organization(updated_org)

    if not updated_org:
        raise HTTPException(500, detail="Erreur lors du rechargement de l'organisation mise à jour")

    return {
        "message": f"Organisation '{slug}' mise à jour",
        "updated_fields": list(update_fields.keys()),
        "new_slug": update_fields.get("slug", slug),  # retourner le nouveau slug si changé
        "organization": updated_org  # ✅ on renvoie l’objet complet mis à jour
    }
