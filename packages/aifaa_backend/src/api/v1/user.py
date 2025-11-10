from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from src.db.database import get_db
from src.schemas.user import UserCreate, UserRead, UserUpdate
from src.services.user_service import UserService
from src.utils.exceptions import NotFoundError, ServiceError

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        return service.create_user(user)
    except ServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db)):
    service = UserService(db)
    return service.list_users()


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        return service.get_user_by_id(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        return service.update_user(user_id, user_data)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{user_id}")
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        service.delete_user(user_id)
        return {"message": "User deleted successfully"}
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
