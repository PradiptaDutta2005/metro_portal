from sqlalchemy import Column, Float, String, ForeignKey , Integer, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from .db import Base


class InputRecord(Base):
    __tablename__ = "dl_inputs"

    rakeId = Column(String, primary_key=True, index=True)
    H1 = Column(Float)
    DV_pressure = Column(Float)
    Reservoirs = Column(Float)
    Oil_temperature = Column(Float)
    Motor_current = Column(Float)
    COMP = Column(String)
    DV_electric = Column(String)
    Towers = Column(String)
    MPG = Column(Float)
    LPS = Column(String)
    Pressure_switch = Column(String)
    Oil_level = Column(Float)
    Caudal_impulses = Column(Float)
    engineer = Column(String)

class ValidationRecord(Base):
    __tablename__ = "validation_records"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    dl_input_id = Column(Integer, ForeignKey("dl_inputs.id", ondelete="CASCADE"), nullable=False)
    rake_identifier = Column(String, nullable=False)
    dl_probability = Column(Float, nullable=False)

    issues = Column(JSON, nullable=False)          # list of strings
    dl_payload = Column(JSON, nullable=False)      # full structured payload

    status = Column(String, default="pending")     # pending / reviewed / closed
    human_ok = Column(Boolean, default=False)
    reviewed_by = Column(String, nullable=True)    # engineer username/id