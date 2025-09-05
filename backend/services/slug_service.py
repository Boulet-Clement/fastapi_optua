import re
import unicodedata
from core.db import db

def generate_unique_slug(name: str, lang: str) -> str:
    """Génère un slug unique basé sur le nom et vérifie en Mongo"""
    # 1. Normalisation Unicode (é -> e)
    name = unicodedata.normalize("NFKD", name)
    name = name.encode("ascii", "ignore").decode("ascii")

    # 2. Remplacement des caractères non alphanumériques par -
    base_slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

    slug = base_slug
    counter = 1

    # 3. Vérification de l'unicité
    while db.organizations.find_one({"slug": slug, "lang": lang}):
        counter += 1
        slug = f"{base_slug}-{counter}"

    return slug
