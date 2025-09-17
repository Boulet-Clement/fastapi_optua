# fastapi_optua

## Reindex elasticsearch
```bash
docker exec -it fastapi python -m commands.reindex_elasticsearch
```

## Importer les categories
```bash
docker exec -it fastapi python -m commands.import_categories
docker exec -it fastapi python -m commands.import_categories datas/1_categories.csv
```

## Importer les keywords
```bash
docker exec -it fastapi python -m commands.import_keywords
docker exec -it fastapi python -m commands.import_keywords datas/2_food_and_drinks.csv
```

xFH8s1XmF.m$