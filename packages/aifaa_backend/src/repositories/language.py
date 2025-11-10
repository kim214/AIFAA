from sqlalchemy.orm import Session
from src.db.models import Language
from src.schemas.language import LanguageCreate, LanguageUpdate

class LanguageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_language(self, payload: LanguageCreate) -> Language:
        language = Language(**payload.dict())
        self.db.add(language)
        self.db.commit()
        self.db.refresh(language)
        return language

    def list_languages(self) -> list[Type[Language]]:
        return self.db.query(Language).all()

    def get_language(self, language_id: int) -> Language | None:
        return self.db.query(Language).filter(Language.id == language_id).first()

    def update_language(self, language_id: int, data: LanguageUpdate) -> Language | None:
        language = self.db.query(Language).filter(Language.id == language_id).first()
        if not language:
            return None
        for key, value in data.dict(exclude_unset=True).items():
            setattr(language, key, value)
        self.db.commit()
        self.db.refresh(language)
        return language

    def delete_language(self, language_id: int) -> bool:
        lang = self.db.query(Language).filter(Language.id == language_id).first()
        if not lang:
            return False
        self.db.delete(lang)
        self.db.commit()
        return True
