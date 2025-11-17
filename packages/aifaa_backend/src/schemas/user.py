from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    preferred_language_id: UUID | None = None

class UserRead(BaseModel):
    id: UUID
    name: str
    preferred_language_id: UUID | None
    created_at: datetime

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
