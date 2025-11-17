from uuid import UUID
from src.repositories.guide_repository import GuideRepository
from src.schemas.guide import GuideCreate, GuideUpdate
from src.utils.exceptions import NotFoundError

class GuideService:
    def __init__(self, db):
        self.repo = GuideRepository(db)

    def create_guide(self, payload: GuideCreate):
        return self.repo.create_guide(payload)

    def list_guides(self):
        return self.repo.list_guides()

    def get_guide(self, guide_id: UUID):
        guide = self.repo.get_guide(guide_id)
        if not guide:
            raise NotFoundError("Guide not found")
        return guide

    def update_guide(self, guide_id: int, data: GuideUpdate):
        guide = self.repo.update_guide(guide_id, data)
        if not guide:
            raise NotFoundError("Guide not found")
        return guide

    def delete_guide(self, guide_id: UUID):
        success = self.repo.delete_guide(guide_id)
        if not success:
            raise NotFoundError("Guide not found")
        return {"message": "Guide deleted successfully"}
