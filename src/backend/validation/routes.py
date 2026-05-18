# src/backend/validation/routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from validation.schemas import ValidationOut, ValidationCreate
from validation.service import (
    create_validation_record,
    list_pending,
    mark_validation_approved,
    mark_validation_rejected,
    list_all_status, 
)

router = APIRouter(tags=["validation"])


@router.get("/pending", response_model=List[ValidationOut])
def get_pending():
    """List all pending validation records."""
    return list_pending()


@router.post("/create", response_model=ValidationOut)
def create_validation(payload: ValidationCreate):
    """Manually create a validation record (for testing/demo)."""
    rec = create_validation_record(
        dl_input_id=payload.dl_input_id,
        rake_identifier=payload.rake_identifier,
        dl_probability=payload.dl_probability,
        issues=payload.issues,
        dl_payload=payload.dl_payload,
    )
    return rec


@router.post("/{validation_id}/approve", response_model=ValidationOut)
def approve(validation_id: int):
    """Mark a validation record as approved by a human reviewer."""
    rec = mark_validation_approved(validation_id, reviewer="maintainer")
    if not rec:
        raise HTTPException(404, "Validation record not found")
    return rec


@router.post("/{validation_id}/reject", response_model=ValidationOut)
def reject(validation_id: int):
    """Mark a validation record as rejected by a human reviewer."""
    rec = mark_validation_rejected(validation_id, reviewer="maintainer")
    if not rec:
        raise HTTPException(404, "Validation record not found")
    return rec


@router.get("/status-summary", response_model=List[ValidationOut])
def status_summary():
    """Return recent validations (approved/rejected/pending)."""
    return list_all_status()

