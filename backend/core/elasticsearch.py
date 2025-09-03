import os
from dotenv import load_dotenv
from elasticsearch import Elasticsearch

# Charger les variables d'environnement
load_dotenv()

# Config depuis .env
ELASTIC_HOST = os.getenv("ELASTIC_HOST", "localhost")
ELASTIC_PORT = os.getenv("ELASTIC_PORT", "9200")
INDEX_NAME = os.getenv("ELASTIC_INDEX", "organizations")

ELASTIC_URL = f"http://{ELASTIC_HOST}:{ELASTIC_PORT}"

# Initialisation du client
elasticsearch = Elasticsearch(ELASTIC_URL)

# Vérifier la connexion
try:
    if elasticsearch.ping():
        print("Elasticsearch connecté !")
    else:
        print("Impossible de se connecter à Elasticsearch")
except Exception as e:
    print(f"Erreur Elasticsearch: {e}")
