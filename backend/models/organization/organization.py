from pydantic import BaseModel, Field
from typing import Optional, List
from models.lang_enum import LangEnum

class Organization(BaseModel):
    organization_id: Optional[str] = None
    lang: LangEnum
    name: str
    description: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)
    slug: Optional[str] = Field(default=None, description="Slug unique basé sur le nom")
    owner_id: Optional[str] = None
    is_hidden: bool = True #User can hide
    is_visible: bool = False #Calculated by is_subscription_paid && is_hidden
