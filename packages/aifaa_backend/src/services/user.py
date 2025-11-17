# src/services/user_service.py
from sqlalchemy.orm import Session
from uuid import UUID
from src.db.models import User
from src.schemas.user import UserCreate, UserUpdate
from src.repositories.user import UserRepository
from src.utils.exceptions import NotFoundError, ServiceError

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = UserRepository(db)

    def create_user(self, user_data: UserCreate):
        try:
            new_user = User(**user_data.dict())
            return self.repo.create(new_user)
        except Exception as e:
            raise ServiceError(f"Failed to create user: {e}")

    def list_users(self):
        return self.repo.list_all()

    def get_user_by_id(self, user_id: UUID):
        user = self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundError(f"User with ID {user_id} not found")
        return user

    def update_user(self, user_id: UUID, user_data: UserUpdate):
        user = self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundError(f"User with ID {user_id} not found")

        for key, value in user_data.dict(exclude_unset=True).items():
            setattr(user, key, value)

        return self.repo.update(user)

    def delete_user(self, user_id: UUID):
        user = self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundError(f"User with ID {user_id} not found")

        self.repo.delete(user)
