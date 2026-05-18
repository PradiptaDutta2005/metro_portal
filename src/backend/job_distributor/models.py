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
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.schema import Sequence

Base = declarative_base()


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
