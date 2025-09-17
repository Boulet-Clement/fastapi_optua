from pydantic import BaseModel
from models.lang_enum import LangEnum

class OrgKeywordAction(BaseModel):
    keyword_code: str
    lang: LangEnum
