from sqlalchemy import Column, Boolean, Integer, String, Enum, Text, TIMESTAMP, ForeignKey, Float, func, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import sys, os, enum, uuid
from datetime import datetime
from src.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    preferred_language_id = Column(ForeignKey("languages.id"))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    language = relationship("Language", back_populates="users")
    chat_sessions = relationship("ChatSession", back_populates="user")
    emergency_logs = relationship("EmergencyCallLog", back_populates="user")

class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True)
    code = Column(String, unique=True)
    region = Column(String, nullable=True)

    users = relationship("User", back_populates="language")
    guides = relationship("FirstAidGuide", back_populates="language")

class FirstAidGuide(Base):
    __tablename__ = "first_aid_guides"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    steps = Column(JSON, nullable=False)
    language_id = Column(ForeignKey("languages.id"))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    language = relationship("Language", back_populates="guides")

class EmergencyCallLog(Base):
    __tablename__ = "emergency_call_logs"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(ForeignKey("users.id"), nullable=True)
    timestamp = Column(TIMESTAMP, default=datetime.utcnow)
    location = Column(String, nullable=True)
    action_taken = Column(String, nullable=True)

    user = relationship("User", back_populates="emergency_logs")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(ForeignKey("users.id"), nullable=True)
    started_at = Column(TIMESTAMP, default=datetime.utcnow)
    ended_at = Column(TIMESTAMP, nullable=True)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("Message", back_populates="session")

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    session_id = Column(ForeignKey("chat_sessions.id"))
    sender = Column(Enum("user", "ai", name="sender_type"))
    content = Column(Text, nullable=False)
    timestamp = Column(TIMESTAMP, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class LocationLog(Base):
    __tablename__ = "location_logs"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(ForeignKey("users.id"), nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(TIMESTAMP, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(ForeignKey("users.id"), nullable=True)
    message = Column(Text)
    rating = Column(Integer)
    submitted_at = Column(TIMESTAMP, default=datetime.utcnow)
