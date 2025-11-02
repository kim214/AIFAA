from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from src.db.models import Language
from src.db.database import get_db
from src.schemas.language_schemas import LanguageRead, LanguageCreate

router = APIRouter(prefix="/users", tags=["Users"])
@router.post("/", response_model=LanguageRead)
def create_language(lang: LanguageCreate, db: Session = Depends(get_db)):
    language = Language(**lang.dict())
    db.add(language)
    db.commit()
    db.refresh(language)
    return language

@router.get("/", response_model=list[LanguageRead])
def list_languages(db: Session = Depends(get_db)):
    return db.query(Language).all()

@router.get("/{language_id}", response_model=LanguageRead)
def get_language(language_id: int, db: Session = Depends(get_db)):
    lang = db.query(Language).filter(Language.id == language_id).first()
    if not lang:
        raise HTTPException(status_code=404, detail="Language not found")
    return lang

@router.put("/{language_id}")
def update_language(language_id: int, data: LanguageUpdate, db: Session = Depends(get_db)):
    language = db.query(Language).filter(Language.id == language_id).first()
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(language, key, value)

    db.commit()
    db.refresh(language)
    return language

@router.delete("/{language_id}")
def delete_language(language_id: int, db: Session = Depends(get_db)):
    lang = db.query(Language).filter(Language.id == language_id).first()
    if not lang:
        raise HTTPException(status_code=404, detail="Language not found")
    db.delete(lang)
    db.commit()
    return {"message": "Language deleted successfully"}
