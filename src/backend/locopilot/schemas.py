from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


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
        from_attributes = True
