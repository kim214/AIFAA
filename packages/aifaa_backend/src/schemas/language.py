from pydantic import BaseModel

class LanguageCreate(BaseModel):
    name: str
    code: str
    region: str | None = None

class LanguageRead(BaseModel):
    id: int
    name: str
    code: str
    region: str | None

class LanguageUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
