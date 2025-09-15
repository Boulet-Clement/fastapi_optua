from fastapi import APIRouter, HTTPException
from fastapi_cache.decorator import cache
from models.lang_enum import LangEnum
from fastapi_cache import FastAPICache

router = APIRouter()

@router.get("/languages")
@cache(namespace="languages", expire=3600)  # cache 1h
async def get_languages():
    return [lang.value for lang in LangEnum]

@router.post("/languages/invalidate")
async def invalidate_languages_cache():
    if FastAPICache.get_backend() is None:
        raise HTTPException(status_code=500, detail="Cache non initialisé")
    await FastAPICache.clear(namespace="languages")
    return {"detail": "Cache invalidé"}
