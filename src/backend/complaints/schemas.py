from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# Request schema
class ComplaintCreate(BaseModel):
    rake_id: str
    complaint: str
    from_location: str
    to_location: str
    category: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None


# Response schema
class ComplaintResponse(BaseModel):
    id: int
    rake_id: str
    complaint: str
    from_location: str
    to_location: str
    category: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
