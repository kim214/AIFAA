from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from src.db.database import get_db
from src.schemas.chat import (
    ChatSessionCreate, ChatSessionRead,
    MessageCreate, MessageRead, ChatUpdate
)
from src.services.chat_service import ChatService
from src.utils.exceptions import NotFoundError

router = APIRouter(prefix="/chat", tags=["Chat Sessions"])


def get_chat_service(db: Session = Depends(get_db)) -> ChatService:
    return ChatService(db)


@router.post("/sessions", response_model=ChatSessionRead)
def start_chat_session(
    payload: ChatSessionCreate,
    service: ChatService = Depends(get_chat_service)
):
    return service.start_chat_session(payload)


@router.get("/sessions", response_model=list[ChatSessionRead])
def list_sessions(
    user_id: UUID | None = None,
    service: ChatService = Depends(get_chat_service)
):
    return service.list_sessions(user_id)


@router.put("/sessions/{session_id}/end")
def end_chat_session(
    session_id: UUID,
    service: ChatService = Depends(get_chat_service)
):
    try:
        return service.end_chat_session(session_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{chat_id}")
def update_chat(
    chat_id: int,
    data: ChatUpdate,
    service: ChatService = Depends(get_chat_service)
):
    try:
        return service.update_chat(chat_id, data)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/messages", response_model=MessageRead)
def add_message(
    payload: MessageCreate,
    service: ChatService = Depends(get_chat_service)
):
    try:
        return service.add_message(payload)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/sessions/{session_id}/messages", response_model=list[MessageRead])
def get_session_messages(
    session_id: UUID,
    service: ChatService = Depends(get_chat_service)
):
    return service.get_session_messages(session_id)
