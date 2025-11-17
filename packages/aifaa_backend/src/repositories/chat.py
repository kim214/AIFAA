from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from src.db.models import ChatSession, Message
from src.schemas.chat import ChatSessionCreate, MessageCreate, ChatUpdate

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, payload: ChatSessionCreate) -> ChatSession:
        session = ChatSession(user_id=payload.user_id)
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def list_sessions(self, user_id: UUID | None = None) -> list[ChatSession]:
        query = self.db.query(ChatSession)
        if user_id:
            query = query.filter(ChatSession.user_id == user_id)
        return query.all()

    def get_session_by_id(self, session_id: UUID) -> ChatSession | None:
        return self.db.query(ChatSession).filter(ChatSession.id == session_id).first()

    def end_session(self, session_id: UUID) -> bool:
        session = self.get_session_by_id(session_id)
        if not session:
            return False
        session.ended_at = datetime.now()
        self.db.commit()
        return True

    # --- Chat Update Method ---
    def update_chat(self, chat_id: int, data: ChatUpdate):
        chat = self.db.query(ChatSession).filter(ChatSession.id == chat_id).first()
        if not chat:
            return None
        for key, value in data.dict(exclude_unset=True).items():
            setattr(chat, key, value)
        self.db.commit()
        self.db.refresh(chat)
        return chat

    # --- Message Methods ---
    def add_message(self, payload: MessageCreate) -> Message:
        new_message = Message(**payload.dict())
        self.db.add(new_message)
        self.db.commit()
        self.db.refresh(new_message)
        return new_message

    def list_session_messages(self, session_id: UUID) -> list[Message]:
        return self.db.query(Message).filter(Message.session_id == session_id).all()
