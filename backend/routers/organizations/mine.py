from fastapi import APIRouter, Request, HTTPException
from core.db import db
from core.auth_utils import get_current_user_from_cookie

router = APIRouter()

@router.get("/organizations/mine")
def get_my_organizations(request: Request):
    # Récupérer l'utilisateur connecté
    payload = get_current_user_from_cookie(request)
    user_id = payload.get("user_id")
    print(payload)

    if not user_id:
        raise HTTPException(status_code=401, detail="Utilisateur non identifié")

    # Récupérer l'utilisateur
    user = db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Retourner la liste des organizations (résumés)
    return user.get("organizations", [])
