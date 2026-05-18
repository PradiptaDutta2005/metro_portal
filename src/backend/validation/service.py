# src/backend/validation/service.py
from typing import Optional, List, Any
from db.database_connection import SessionLocal
from validation.models import ValidationRecord


def create_validation_record(
    dl_input_id: Optional[int],
    rake_identifier: Optional[str],
    dl_probability: Optional[float],
    issues: Optional[List[Any]] = None,
    dl_payload: Optional[Any] = None,
) -> ValidationRecord:
    """Insert a new validation record into validation_records table."""
    db = SessionLocal()
    try:
        rec = ValidationRecord(
        dl_input_id=dl_input_id,
        rake_identifier=rake_identifier,
        dl_probability=dl_probability,  # ✅ store float directly
        issues=issues or [],
        dl_payload=dl_payload,
        status="pending",
        human_ok=False,
    )

        db.add(rec)
        db.commit()
        db.refresh(rec)
        return rec
    finally:
        db.close()


def list_pending(limit: int = 100) -> List[ValidationRecord]:
    """Fetch recent pending validation records."""
    db = SessionLocal()
    try:
        return (
            db.query(ValidationRecord)
            .filter(ValidationRecord.status == "pending")
            .order_by(ValidationRecord.created_at.desc())
            .limit(limit)
            .all()
        )
    finally:
        db.close()


def mark_validation_approved(
    validation_id: int, reviewer: Optional[str] = None
) -> Optional[ValidationRecord]:
    """Mark a validation record as approved by human reviewer."""
    db = SessionLocal()
    try:
        rec = db.query(ValidationRecord).filter(ValidationRecord.id == validation_id).one_or_none()
        if not rec:
            return None
        rec.status = "approved"
        rec.human_ok = True
        rec.reviewed_by = reviewer
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return rec
    finally:
        db.close()


def mark_validation_rejected(
    validation_id: int, reviewer: Optional[str] = None
) -> Optional[ValidationRecord]:
    """Mark a validation record as rejected by human reviewer."""
    db = SessionLocal()
    try:
        rec = db.query(ValidationRecord).filter(ValidationRecord.id == validation_id).one_or_none()
        if not rec:
            return None
        rec.status = "rejected"
        rec.human_ok = False
        rec.reviewed_by = reviewer
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return rec
    finally:
        db.close()
        
def list_all_status(limit: int = 50):
    """Return latest validations with rake + status."""
    db = SessionLocal()
    try:
        return (
            db.query(ValidationRecord)
            .order_by(ValidationRecord.created_at.desc())
            .limit(limit)
            .all()
        )
    finally:
        db.close()

