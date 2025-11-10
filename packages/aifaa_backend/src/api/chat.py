from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from src.db.models import ChatSession, Message
from src.db.database import get_db
from src.schemas.chat_schemas import (
    ChatSessionCreate, ChatSessionRead,
    MessageCreate, MessageRead
)
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["Chat Sessions"])

@router.post("/sessions", response_model=ChatSessionRead)
def start_chat_session(payload: ChatSessionCreate, db: Session = Depends(get_db)):
    session = ChatSession(user_id=payload.user_id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/sessions", response_model=list[ChatSessionRead])
def list_sessions(user_id: UUID | None = None, db: Session = Depends(get_db)):
    query = db.query(ChatSession)
    if user_id:
        query = query.filter(ChatSession.user_id == user_id)
    return query.all()

@router.put("/sessions/{session_id}/end")
def end_chat_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.ended_at = datetime.now()
    db.commit()
    return {"message": "Session ended"}

@router.put("/{chat_id}")
def update_chat(chat_id: int, data: ChatUpdate, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(chat, key, value)

    db.commit()
    db.refresh(chat)
    return chat

@router.post("/messages", response_model=MessageRead)
def add_message(message: MessageCreate, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == message.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    new_msg = Message(**message.dict())
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@router.get("/sessions/{session_id}/messages", response_model=list[MessageRead])
def get_session_messages(session_id: UUID, db: Session = Depends(get_db)):
    return db.query(Message).filter(Message.session_id == session_id).all()
