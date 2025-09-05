from pydantic import BaseModel

class Tag(BaseModel):
    code: str
    lang: str
    name: str
