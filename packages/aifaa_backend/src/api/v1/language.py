from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.schemas.language import LanguageCreate, LanguageRead, LanguageUpdate
from src.services.language import LanguageService
from src.utils.exceptions import NotFoundError

router = APIRouter(prefix="/languages", tags=["Languages"])

def get_language_service(db: Session = Depends(get_db)) -> LanguageService:
    return LanguageService(db)

@router.post("/", response_model=LanguageRead)
def create_language(
    payload: LanguageCreate,
    service: LanguageService = Depends(get_language_service)
):
    return service.create_language(payload)

@router.get("/", response_model=list[LanguageRead])
def list_languages(service: LanguageService = Depends(get_language_service)):
    return service.list_languages()

@router.get("/{language_id}", response_model=LanguageRead)
def get_language(
    language_id: int,
    service: LanguageService = Depends(get_language_service)
):
    try:
        return service.get_language(language_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{language_id}")
def update_language(
    language_id: int,
    data: LanguageUpdate,
    service: LanguageService = Depends(get_language_service)
):
    try:
        return service.update_language(language_id, data)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{language_id}")
def delete_language(
    language_id: int,
    service: LanguageService = Depends(get_language_service)
):
    try:
        return service.delete_language(language_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
