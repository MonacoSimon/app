from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.notas_schema import NoteCreate, NoteUpdate, NoteOut  
from ..services.notas_service import NoteService 
from typing import List

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.get("/", response_model=List[NoteOut])
def list_notes(archived: bool = False, db: Session = Depends(get_db)):
    return NoteService.list_notes(db, archived)


@router.post("/", response_model=NoteOut)
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    return NoteService.create_note(db, data)


@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db)):
    return NoteService.update_note(db, note_id, data)


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    NoteService.delete_note(db, note_id)
    return {"message": "Note deleted"}


@router.put("/{note_id}/archive", response_model=NoteOut)
def archive_note(note_id: int, db: Session = Depends(get_db)):
    return NoteService.archive_note(db, note_id, True)


@router.put("/{note_id}/unarchive", response_model=NoteOut)
def unarchive_note(note_id: int, db: Session = Depends(get_db)):
    return NoteService.archive_note(db, note_id, False)