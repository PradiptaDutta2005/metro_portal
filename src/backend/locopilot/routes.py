from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.sql import func
from typing import List
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

# ---------------------------
# Database Setup
# ---------------------------
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


# ---------------------------
# SQLAlchemy Model
# ---------------------------
class LocoPilotReading(Base):
    __tablename__ = "loco_pilot_readings"

    id = Column(Integer, primary_key=True, index=True)
    rake_id = Column(String, nullable=False)
    from_station = Column(String, nullable=False)
    to_station = Column(String, nullable=False)
    reading_time = Column(DateTime(timezone=True), server_default=func.now())
    tcms_reading = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)


# Create table if it doesn't exist
Base.metadata.create_all(bind=engine)


# ---------------------------
# Pydantic Schemas
# ---------------------------
class LocoPilotReadingBase(BaseModel):
    rake_id: str = Field(..., example="R123")
    from_station: str = Field(..., example="Kochi Metro - Aluva")
    to_station: str = Field(..., example="Kochi Metro - Maharaja's")
    reading_time: datetime = Field(..., example="2025-09-12T10:30:00Z")
    tcms_reading: Optional[str] = Field(None, example='{"voltage": 750, "speed": 45}')
    remarks: Optional[str] = Field(None, example="Smooth run, no issues")


class LocoPilotReadingCreate(LocoPilotReadingBase):
    pass


class LocoPilotReadingResponse(LocoPilotReadingBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2


# ---------------------------
# API Router
# ---------------------------
router = APIRouter(
    prefix="/api/locopilot",
    tags=["LocoPilot"],
)


@router.post("/readings", response_model=LocoPilotReadingResponse)
def create_reading(reading: LocoPilotReadingCreate, db: Session = Depends(get_db)):
    db_reading = LocoPilotReading(
        rake_id=reading.rake_id,
        from_station=reading.from_station,
        to_station=reading.to_station,
        reading_time=reading.reading_time,
        tcms_reading=reading.tcms_reading,
        remarks=reading.remarks,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading


@router.get("/readings", response_model=List[LocoPilotReadingResponse])
def list_readings(db: Session = Depends(get_db)):
    return db.query(LocoPilotReading).all()


@router.get("/readings/{reading_id}", response_model=LocoPilotReadingResponse)
def get_reading(reading_id: int, db: Session = Depends(get_db)):
    reading = db.query(LocoPilotReading).filter(LocoPilotReading.id == reading_id).first()
    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found")
    return reading


@router.delete("/readings/{reading_id}")
def delete_reading(reading_id: int, db: Session = Depends(get_db)):
    reading = db.query(LocoPilotReading).filter(LocoPilotReading.id == reading_id).first()
    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found")
    db.delete(reading)
    db.commit()
    return {"message": f"Reading {reading_id} deleted"}
