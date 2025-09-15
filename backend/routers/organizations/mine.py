from fastapi import APIRouter, Request, HTTPException, Query
from core.db import db
from core.auth_utils import get_current_user_from_cookie
from typing import Optional

router = APIRouter()

@router.get("/organizations/mine")
def get_my_organizations(request: Request, lang: Optional[str] = Query(None, description="Filtrer par langue")):
    """
    Récupère les organisations de l'utilisateur connecté.
    Si `lang` est fourni, ne retourne que les organisations qui contiennent cette langue.
    """
    # Récupérer l'utilisateur connecté
    payload = get_current_user_from_cookie(request)
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Utilisateur non identifié")

    # Récupérer l'utilisateur
    user = db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    organizations = user.get("organizations", [])
    print(organizations)
    # Filtrer par langue si spécifié
    if lang:
        organizations = [
            org for org in organizations
            if lang in org.get("lang", [])
        ]

    return organizations
