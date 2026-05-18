# src/backend/dl_model/validation/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fails fast: good so you don't silently write to wrong DB
    raise RuntimeError("DATABASE_URL is not set in environment")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Create validation tables (call at startup or run manually)."""
    Base.metadata.create_all(bind=engine)
