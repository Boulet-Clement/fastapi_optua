import csv
import sys
from core.db import db
from models.keyword import Keyword

COLLECTION_NAME = "keywords"

def import_keywords(csv_path: str):
    collection = db[COLLECTION_NAME]

    with open(csv_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            # Convertir display_on_search_engine en bool si nécessaire
            if "display_on_search_engine" in row:
                val = row["display_on_search_engine"].strip().lower()
                row["display_on_search_engine"] = val in ("1", "true", "yes", "x", "X")

            try:
                keyword = Keyword(**row)  # validation Pydantic
            except Exception as e:
                print(f"Ligne invalide {row}: {e}")
                continue

            # upsert : insert si n'existe pas, update si existe
            result = collection.update_one(
                {"code": keyword.code, "lang": keyword.lang},
                {"$set": {
                    "name": keyword.name,
                    "category_code": keyword.category_code,
                    "display_on_search_engine": keyword.display_on_search_engine
                }},
                upsert=True
            )
            action = "Updated" if result.matched_count else "Inserted"
            print(f"{action} {keyword.code}-{keyword.lang} => {keyword.name}")

    print("Import terminé !")

if __name__ == "__main__":
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "keywords.csv"
    import_keywords(csv_path)
