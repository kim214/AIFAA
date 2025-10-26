from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from config import settings

Base = declarative_base()
engine = create_engine(settings.DATABASE_URL)
