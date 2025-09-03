from fastapi import FastAPI
from routers import organization

app = FastAPI()

# Inclure le router
app.include_router(organization.router)
