from src.repositories.chat import ChatRepository
from src.utils.exceptions import NotFoundError

class ChatService:
    def __init__(self, db):
        self.repo = ChatRepository(db)

    def start_chat_session(self, payload):
        return self.repo.create_session(payload)

    def list_sessions(self, user_id=None):
        return self.repo.list_sessions(user_id)

    def end_chat_session(self, session_id):
        if not self.repo.end_session(session_id):
            raise NotFoundError("Session not found")
        return {"message": "Session ended"}

    def update_chat(self, chat_id, data):
        chat = self.repo.update_chat(chat_id, data)
        if not chat:
            raise NotFoundError("Chat not found")
        return chat

    def add_message(self, payload):
        session = self.repo.get_session_by_id(payload.session_id)
        if not session:
            raise NotFoundError("Session not found")
        return self.repo.add_message(payload)

    def get_session_messages(self, session_id):
        return self.repo.list_session_messages(session_id)
