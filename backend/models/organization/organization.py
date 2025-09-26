from pydantic import BaseModel, Field
from typing import Optional, List
from models.lang_enum import LangEnum

class Organization(BaseModel):
    organization_id: Optional[str] = None
    lang: LangEnum
    # summary
    name: str
    chapo: Optional[str] = None
    description: Optional[str] = None
    is_hidden: bool = True #User can hide
    # keywords
    keywords: List[str] = Field(default_factory=list)
    # calculated
    slug: Optional[str] = Field(default=None, description="Slug unique basé sur le nom")
    owner_id: Optional[str] = None
    is_visible: bool = False #Calculated by is_subscription_paid && is_hidden
