import csv
import sys
from core.db import db
from models.tag import Tag  # ton modèle Pydantic Tag

COLLECTION_NAME = "tags"

def import_tags(csv_path: str):
    collection = db[COLLECTION_NAME]

    with open(csv_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            # Convertir display_on_search_engine en bool si nécessaire
            if "display_on_search_engine" in row:
                val = row["display_on_search_engine"].strip().lower()
                row["display_on_search_engine"] = val in ("1", "true", "yes", "x", "X")

            try:
                tag = Tag(**row)  # validation Pydantic
            except Exception as e:
                print(f"Ligne invalide {row}: {e}")
                continue

            # upsert : insert si n'existe pas, update si existe
            result = collection.update_one(
                {"code": tag.code, "lang": tag.lang},
                {"$set": {
                    "name": tag.name,
                    "category_code": tag.category_code,
                    "display_on_search_engine": tag.display_on_search_engine
                }},
                upsert=True
            )
            action = "Updated" if result.matched_count else "Inserted"
            print(f"{action} {tag.code}-{tag.lang} => {tag.name}")

    print("Import terminé !")

if __name__ == "__main__":
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "tags.csv"
    import_tags(csv_path)
