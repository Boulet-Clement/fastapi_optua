from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import organization, category, tag, filters, search
from routers.user import auth
from core.elasticsearch import elasticsearch, INDEX_NAME
import time

app = FastAPI()

# Autoriser CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ⚠️ à restreindre en prod (ex: ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(organization.router)
app.include_router(category.router)
app.include_router(tag.router)
app.include_router(filters.router)
app.include_router(search.router)
app.include_router(auth.router)

@app.on_event("startup")
def startup_event():
    # Retry pour Elasticsearch
    for _ in range(10):
        try:
            if elasticsearch.ping():
                print("Elasticsearch connecté !")
                break
        except Exception:
            pass
        print("Attente d'Elasticsearch...")
        time.sleep(2)
    else:
        print("Impossible de se connecter à Elasticsearch")
        return  # ou raise Exception si tu veux arrêter le démarrage

    # Créer l'index si inexistant
    if not elasticsearch.indices.exists(index=INDEX_NAME):
        elasticsearch.indices.create(index=INDEX_NAME)
        print(f"Index {INDEX_NAME} créé")
