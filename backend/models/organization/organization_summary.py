from pydantic import BaseModel
from typing import Optional
from models.lang_enum import LangEnum

class OrganizationSummary(BaseModel):
    organization_id: str  # identifiant logique
    name: str
    slug: Optional[str]
    lang: LangEnum  # version linguistique
