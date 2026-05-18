from sqlalchemy import Column, Integer, String, Float, JSON, TIMESTAMP, func, Boolean
from db.database_connection import Base  # 👈 use global Base here


class ValidationRecord(Base):
    __tablename__ = "validation_records"

    id = Column(Integer, primary_key=True, index=True)
    dl_input_id = Column(Integer, nullable=True)
    rake_identifier = Column(String, nullable=True)
    dl_probability = Column(Float, nullable=True)
    issues = Column(JSON, nullable=True)
    dl_payload = Column(JSON, nullable=True)
    status = Column(String, default="pending")
    human_ok = Column(Boolean, default=False)
    reviewed_by = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
