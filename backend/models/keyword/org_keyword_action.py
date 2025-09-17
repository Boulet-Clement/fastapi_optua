from pydantic import BaseModel
from models.lang_enum import LangEnum

class OrgKeywordAction(BaseModel):
    organization_id: str
    keyword_code: str
    lang: LangEnum
