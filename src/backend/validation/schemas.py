# src/backend/dl_model/validation/schemas.py
from pydantic import BaseModel
from typing import Optional, List, Any


class ValidationCreate(BaseModel):
    dl_input_id: Optional[int]
    rake_identifier: Optional[str]
    dl_probability: Optional[float]
    issues: Optional[List[Any]] = None
    dl_payload: Optional[Any] = None


class ValidationOut(BaseModel):
    id: int
    dl_input_id: Optional[int]
    rake_identifier: Optional[str]
    dl_probability: Optional[float]  
    issues: Optional[List[Any]]
    dl_payload: Optional[Any]
    status: str
    human_ok: bool
    reviewed_by: Optional[str]

    class Config:
        from_attributes = True

