from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
import redis.asyncio as redis
from routers import filters, search, languages
from routers.user import auth, profil
from routers.dashboard import dashboard_home
from routers.organizations import crud, mine, organization_keywords
from routers.keywords import crud_keywords
from routers.categories import crud_categories
from core.elasticsearch import elasticsearch, INDEX_NAME
import asyncio

app = FastAPI()

# Autoriser CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ⚠️ à restreindre en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(mine.router)
app.include_router(crud.router)
app.include_router(organization_keywords.router)
app.include_router(profil.router)
app.include_router(crud_keywords.router)
app.include_router(crud_categories.router)
app.include_router(filters.router)
app.include_router(search.router)
app.include_router(auth.router)
app.include_router(dashboard_home.router)
app.include_router(languages.router)

@app.on_event("startup")
async def startup_event():
    # ⚡ Initialisation Redis async
    redis_client = redis.Redis(host="redis", port=6379)
    FastAPICache.init(RedisBackend(redis_client), prefix="fastapi-cache")
    print("FastAPI Cache initialisé avec Redis")

    # Retry pour Elasticsearch
    for _ in range(10):
        try:
            if elasticsearch.ping():
                print("Elasticsearch connecté !")
                break
        except Exception:
            pass
        print("Attente d'Elasticsearch...")
        await asyncio.sleep(2)
    else:
        print("Impossible de se connecter à Elasticsearch")
        return

    # Créer l'index si inexistant
    if not elasticsearch.indices.exists(index=INDEX_NAME):
        elasticsearch.indices.create(index=INDEX_NAME)
        print(f"Index {INDEX_NAME} créé")
