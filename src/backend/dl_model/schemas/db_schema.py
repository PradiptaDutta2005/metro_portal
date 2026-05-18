import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class InputRecord(Base):
    __tablename__ = "dl_inputs"
    id = Column("id", Integer, primary_key=True, index=True)
    H1 = Column("h1", Float)
    DV_pressure = Column("dv_pressure", Float)
    Reservoirs = Column("reservoirs", Float)
    Oil_temperature = Column("oil_temperature", Float)
    Motor_current = Column("motor_current", Float)
    COMP = Column("comp", String)
    DV_electric = Column("dv_electric", String)
    Towers = Column("towers", String)
    MPG = Column("mpg", Float)
    LPS = Column("lps", String)
    Pressure_switch = Column("pressure_switch", String)
    Oil_level = Column("oil_level", Float)
    Caudal_impulses = Column("caudal_impulses", Float)
    engineer = Column("engineer", String)
    timestamp = Column("timestamp", DateTime, default=datetime.datetime.utcnow)
    label_text = Column("label_text", String, nullable=True)
    label = Column("label", Integer, nullable=True)
