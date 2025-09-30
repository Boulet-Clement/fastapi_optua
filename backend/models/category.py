from pydantic import BaseModel

class Category(BaseModel):
    code: str
    lang: str
    name: str
    priority: int
