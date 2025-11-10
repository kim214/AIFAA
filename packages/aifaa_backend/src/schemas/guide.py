from pydantic import BaseModel

class GuideCreate(BaseModel):
    title: str
    category: str
    steps: list[str]
    language_id: int

class GuideRead(BaseModel):
    id: UUID
    title: str
    category: str
    steps: list[str]
    created_at: datetime

class GuideUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
