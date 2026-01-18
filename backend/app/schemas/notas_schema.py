from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteOut(NoteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None  # <--- Cambia esto
    archived: bool = False
    
    class Config:
        from_attributes = True