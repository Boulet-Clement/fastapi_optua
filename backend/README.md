# fastapi_optua

## A chaque ajoute dans le requirements.txt
```bash
docker-compose build fastapi
docker-compose up -d
```

## Reindex elasticsearch
```bash
docker exec -it fastapi python -m commands.reindex_elasticsearch
```


