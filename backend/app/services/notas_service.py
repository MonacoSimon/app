from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..repositorios.notas_repositorio import NoteRepository  
from ..schemas.notas_schema import NoteCreate, NoteUpdate 


class NoteService:

    @staticmethod
    def list_notes(db: Session, archived: bool):
        return NoteRepository.get_all(db, archived)

    @staticmethod
    def create_note(db: Session, data: NoteCreate):
        return NoteRepository.create(db, data)

    @staticmethod
    def update_note(db: Session, note_id: int, data: NoteUpdate):
        note = NoteRepository.get_by_id(db, note_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        return NoteRepository.update(db, note, data)

    @staticmethod
    def delete_note(db: Session, note_id: int):
        note = NoteRepository.get_by_id(db, note_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        NoteRepository.delete(db, note)

    @staticmethod
    def archive_note(db: Session, note_id: int, archived: bool):
        note = NoteRepository.get_by_id(db, note_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        return NoteRepository.toggle_archive(db, note, archived)