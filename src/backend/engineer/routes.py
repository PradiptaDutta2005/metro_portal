from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import List, Optional
from pydantic import BaseModel
from engineer.schemas import JobCardResponse

from sqlalchemy import (
    JSON,
    TIMESTAMP,
    BigInteger,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

# --- Database setup ---
DATABASE_URL = "postgresql+psycopg2://metro_admin:metro_passsword_1234@localhost:5433/metrosaathi"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Models ---
class JobCard(Base):
    __tablename__ = "job_cards"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    dl_input_id = Column(BigInteger, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    status = Column(String(32), default="pending")
    assigned_to = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    priority = Column(Integer, default=1)
    title = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    reasons = Column(JSON, nullable=True)
    suggested_actions = Column(JSON, nullable=True)
    meta_info = Column(JSON, nullable=True)
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    engineer = relationship("User", back_populates="jobs")


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True)
    role = Column(String(64))

    jobs = relationship("JobCard", back_populates="engineer")


# --- Router ---
router = APIRouter(tags=["JobCards"])


@router.get("/jobcards", response_model=List[JobCardResponse])
def list_jobcards(db: Session = Depends(get_db)):
    return db.query(JobCard).all()


@router.get("/jobcards/{jobcard_id}", response_model=JobCardResponse)
def get_jobcard(jobcard_id: int, db: Session = Depends(get_db)):
    jobcard = db.query(JobCard).filter(JobCard.id == jobcard_id).first()
    if not jobcard:
        raise HTTPException(status_code=404, detail="JobCard not found")
    return jobcard

