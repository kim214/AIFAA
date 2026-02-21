from src.repositories.language import LanguageRepository
from src.schemas.language import LanguageCreate, LanguageUpdate
from src.utils.exceptions import NotFoundError

class LanguageService:
    def __init__(self, db):
        self.repo = LanguageRepository(db)

    def create_language(self, payload: LanguageCreate):
        return self.repo.create_language(payload)

    def list_languages(self):
        return self.repo.list_languages()

    def get_language(self, language_id: int):
        lang = self.repo.get_language(language_id)
        if not lang:
            raise NotFoundError("Language not found")
        return lang

    def update_language(self, language_id: int, data: LanguageUpdate):
        lang = self.repo.update_language(language_id, data)
        if not lang:
            raise NotFoundError("Language not found")
        return lang

    def delete_language(self, language_id: int):
        success = self.repo.delete_language(language_id)
        if not success:
            raise NotFoundError("Language not found")
        return {"message": "Language deleted successfully"}
