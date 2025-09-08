from pydantic import BaseModel

class Tag(BaseModel):
    code: str
    lang: str
    name: str
    category_code: str
    display_on_search_engine: bool = False
