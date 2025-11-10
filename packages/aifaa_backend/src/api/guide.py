from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from src.db.models import FirstAidGuide
from src.db.database import get_db
from src.schemas.guide_schemas import GuideCreate, GuideRead

router = APIRouter(prefix="/guides", tags=["First Aid Guides"])

@router.post("/", response_model=GuideRead)
def create_guide(guide: GuideCreate, db: Session = Depends(get_db)):
    new_guide = FirstAidGuide(**guide.dict())
    db.add(new_guide)
    db.commit()
    db.refresh(new_guide)
    return new_guide

@router.get("/", response_model=list[GuideRead])
def list_guides(db: Session = Depends(get_db)):
    return db.query(FirstAidGuide).all()

@router.get("/{guide_id}", response_model=GuideRead)
def get_guide(guide_id: UUID, db: Session = Depends(get_db)):
    guide = db.query(FirstAidGuide).filter(FirstAidGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    return guide

@router.put("/{guide_id}")
def update_guide(guide_id: int, data: GuideUpdate, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(guide, key, value)

    db.commit()
    db.refresh(guide)
    return guide


@router.delete("/{guide_id}")
def delete_guide(guide_id: UUID, db: Session = Depends(get_db)):
    guide = db.query(FirstAidGuide).filter(FirstAidGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    db.delete(guide)
    db.commit()
    return {"message": "Guide deleted successfully"}
