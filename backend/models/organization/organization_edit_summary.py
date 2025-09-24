from pydantic import BaseModel
from typing import Optional
from models.lang_enum import LangEnum

class OrganizationEditSummary(BaseModel):
    name: Optional[str] = None
    chapo: Optional[str] = None
    description: Optional[str] = None
    is_hidden: Optional[bool] = None
    lang: LangEnum
