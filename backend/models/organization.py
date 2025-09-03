from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

# Liste finie de tags
class TagEnum(str, Enum):
    sport = "sport"
    culture = "culture"
    education = "education"
    music = "music"
    food = "food"

class Organization(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[List[TagEnum]] = []
