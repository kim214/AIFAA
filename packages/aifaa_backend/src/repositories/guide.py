from sqlalchemy.orm import Session
from uuid import UUID
from src.db.models import FirstAidGuide
from src.schemas.guide import GuideCreate, GuideUpdate

class GuideRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_guide(self, payload: GuideCreate) -> FirstAidGuide:
        guide = FirstAidGuide(**payload.model_dump())
        self.db.add(guide)
        self.db.commit()
        self.db.refresh(guide)
        return guide

    def list_guides(self) -> list[FirstAidGuide]:
        return self.db.query(FirstAidGuide).all()

    def get_guide(self, guide_id: UUID) -> FirstAidGuide | None:
        return self.db.query(FirstAidGuide).filter(FirstAidGuide.id == guide_id).first()

    def update_guide(self, guide_id: int, data: GuideUpdate) -> FirstAidGuide | None:
        guide = self.db.query(FirstAidGuide).filter(FirstAidGuide.id == guide_id).first()
        if not guide:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(guide, key, value)
        self.db.commit()
        self.db.refresh(guide)
        return guide

    def delete_guide(self, guide_id: UUID) -> bool:
        guide = self.db.query(FirstAidGuide).filter(FirstAidGuide.id == guide_id).first()
        if not guide:
            return False
        self.db.delete(guide)
        self.db.commit()
        return True
