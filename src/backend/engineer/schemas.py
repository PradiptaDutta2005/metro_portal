from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel

class JobCardResponse(BaseModel):
    id: int
    dl_input_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    status: str
    assigned_to: Optional[int]
    priority: int
    title: Optional[str]
    description: Optional[str]

    # Accept both dict and list for JSON fields
    reasons: Optional[Union[Dict[str, Any], List[Any]]]
    suggested_actions: Optional[Union[Dict[str, Any], List[Any]]]
    meta_info: Optional[Union[Dict[str, Any], List[Any]]]

    class Config:
        orm_mode = True
