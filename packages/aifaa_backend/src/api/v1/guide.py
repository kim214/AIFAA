from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from src.db.database import get_db
from src.schemas.guide import GuideCreate, GuideRead, GuideUpdate
from src.services.guide import GuideService
from src.utils.exceptions import NotFoundError

router = APIRouter(prefix="/guides", tags=["First Aid Guides"])

def get_guide_service(db: Session = Depends(get_db)) -> GuideService:
    return GuideService(db)


@router.post("/", response_model=GuideRead)
def create_guide(
    payload: GuideCreate,
    service: GuideService = Depends(get_guide_service)
):
    return service.create_guide(payload)


@router.get("/", response_model=list[GuideRead])
def list_guides(service: GuideService = Depends(get_guide_service)):
    return service.list_guides()


@router.get("/{guide_id}", response_model=GuideRead)
def get_guide(
    guide_id: UUID,
    service: GuideService = Depends(get_guide_service)
):
    try:
        return service.get_guide(guide_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{guide_id}")
def update_guide(
    guide_id: int,
    data: GuideUpdate,
    service: GuideService = Depends(get_guide_service)
):
    try:
        return service.update_guide(guide_id, data)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{guide_id}")
def delete_guide(
    guide_id: UUID,
    service: GuideService = Depends(get_guide_service)
):
    try:
        return service.delete_guide(guide_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
