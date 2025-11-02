from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class MessageBase(BaseModel):
    sender: str  # "user" or "ai"
    content: str

class MessageCreate(MessageBase):
    session_id: UUID

class MessageRead(MessageBase):
    id: UUID
    timestamp: datetime

    class Config:
        orm_mode = True


class ChatSessionBase(BaseModel):
    user_id: Optional[UUID] = None

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionRead(ChatSessionBase):
    id: UUID
    started_at: datetime
    ended_at: Optional[datetime]
    messages: Optional[List[MessageRead]] = []

    class Config:
        orm_mode = True

class ChatSessionUpdate(BaseModel):
    message: Optional[str] = None
    response: Optional[str] = None
