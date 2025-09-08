import csv
import sys
from core.db import db
from models.category import Category

## retravailler le csv, maybe code, nom_fr, nom_en, ... au lieu d'une ligne par langue

COLLECTION_NAME = "categories"

def import_categories(csv_path: str):
    collection = db[COLLECTION_NAME]

    with open(csv_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            try:
                cat = Category(**row)  # validation Pydantic
            except Exception as e:
                print(f"Ligne invalide {row}: {e}")
                continue

            # upsert : insert si n'existe pas, update si existe
            result = collection.update_one(
                {"code": cat.code, "lang": cat.lang},
                {"$set": {"name": cat.name}},
                upsert=True
            )
            action = "Updated" if result.matched_count else "Inserted"
            print(f"{action} {cat.code}-{cat.lang} => {cat.name}")

    print("Import terminé !")

if __name__ == "__main__":
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "categories.csv"
    import_categories(csv_path)
