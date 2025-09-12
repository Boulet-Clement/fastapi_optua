# app/main.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from core.db import db  # <- ta connexion Mongo (ton fichier db.py)
from core.auth_utils import hash_password, verify_password, create_access_token, get_current_user_from_cookie
from models.user.user_register import UserRegister
from models.user.user_login import UserLogin
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

users_collection = db["users"]

@router.post("/register")
def register(user: UserRegister):
    """
    Inscription d'un nouvel utilisateur
    """
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    if not user.user_id:
        user.user_id = str(uuid.uuid4())

    hashed_pw = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "user_id": user.user_id
    }
    users_collection.insert_one(new_user)

    return {"message": "Utilisateur créé avec succès", "email": user.email}


@router.post("/login")
def login(user: UserLogin):
    """
    Connexion utilisateur + génération JWT
    """
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    token = create_access_token({"sub": str(db_user["_id"]), "email": db_user["email"], "user_id": db_user["user_id"]})

    response = JSONResponse({"message": "Connexion réussie"})
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,       # True en prod avec HTTPS, False en dev
        samesite="lax",    # ou "strict"
        max_age=3600       # durée de validité
    )
    return response
