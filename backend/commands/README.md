# fastapi_optua

## Reindex elasticsearch
```bash
curl -X DELETE "http://localhost:9200/organizations_fr"

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
docker exec -it fastapi python -m commands.import_keywords datas/3_services.csv
docker exec -it fastapi python -m commands.import_keywords datas/4_business.csv
docker exec -it fastapi python -m commands.import_keywords datas/5_activities.csv
docker exec -it fastapi python -m commands.import_keywords datas/6_sports.csv
docker exec -it fastapi python -m commands.import_keywords datas/7_sizes.csv
docker exec -it fastapi python -m commands.import_keywords datas/8_events.csv
docker exec -it fastapi python -m commands.import_keywords datas/9_types.csv
docker exec -it fastapi python -m commands.import_keywords datas/10_years_old.csv
docker exec -it fastapi python -m commands.import_keywords datas/11_genders.csv
```
