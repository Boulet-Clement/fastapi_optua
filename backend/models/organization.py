from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class LangEnum(str, Enum):
    fr = "fr"
    en = "en"

class Organization(BaseModel):
    organization_id: Optional[str] = None
    lang: LangEnum
    name: str
    description: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    slug: Optional[str] = Field(default=None, description="Slug unique basé sur le nom")
