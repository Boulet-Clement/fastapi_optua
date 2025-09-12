from pydantic import BaseModel, EmailStr
from typing import List, Optional
from models.organization.organization_summary import OrganizationSummary

class User(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    organizations: List[OrganizationSummary] = []  # liste des organization_id que l'utilisateur possède
