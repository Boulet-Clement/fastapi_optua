from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from core.db import db  # <- ta connexion Mongo (ton fichier db.py)
from core.auth_utils import hash_password, verify_password, create_access_token, get_current_user_from_cookie
from models.user.user_register import UserRegister
from models.user.user_login import UserLogin

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.post("/")
def dashboard(current_user=Depends(get_current_user_from_cookie)):
    print(current_user)
    return {
        "message": f"Bienvenue {current_user['email']}",
        "user": current_user  # <- renvoie tout le payload du JWT
    }
