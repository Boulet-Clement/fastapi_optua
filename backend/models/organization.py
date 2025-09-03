from pydantic import BaseModel
from typing import Optional

class Organization(BaseModel):
    name: str
    description: Optional[str] = None
