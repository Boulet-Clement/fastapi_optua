# fastapi_optua

## Reindex elasticsearch
```bash
docker exec -it fastapi python -m commands.reindex_elasticsearch
```

## Importer les categories
```bash
docker exec -it fastapi python -m commands.import_categories
docker exec -it fastapi python -m commands.import_categories datas/categories.csv
```

xFH8s1XmF.m$