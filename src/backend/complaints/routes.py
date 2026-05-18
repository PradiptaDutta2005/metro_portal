from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import TIMESTAMP, Column, Integer, String, Text, create_engine, func
from sqlalchemy.orm import declarative_base, sessionmaker

from .schemas import ComplaintCreate, ComplaintResponse

# --- Database config ---
DATABASE_URL = (
    "postgresql+psycopg2://metro_admin:metro_passsword_1234@localhost:5433/metrosaathi"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


# --- SQLAlchemy model ---
class ComplaintDB(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    rake_id = Column(String(50), nullable=False)
    complaint = Column(Text, nullable=False)
    from_location = Column(String(100), nullable=False)
    to_location = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())


# Ensure table exists
Base.metadata.create_all(bind=engine)


# --- Router setup ---
router = APIRouter(prefix="/api/complaints", tags=["complaints"])


@router.post("/", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate):
    db = SessionLocal()
    try:
        new_complaint = ComplaintDB(**complaint.dict())
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        return new_complaint
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/", response_model=list[ComplaintResponse])
def get_complaints():
    """
    Fetch all complaints from the database,
    ordered by earliest first.
    """
    db = SessionLocal()
    try:
        complaints = db.query(ComplaintDB).order_by(ComplaintDB.created_at.asc()).all()
        return complaints
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
