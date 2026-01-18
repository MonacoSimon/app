from sqlalchemy.orm import Session
from ..models.notas import Note
from ..schemas.notas_schema import NoteCreate, NoteUpdate 

class NoteRepository:

    @staticmethod
    def get_all(db: Session, archived: bool = None):
        query = db.query(Note)
        if archived is not None:
            query = query.filter(Note.archived == archived)
        return query.all()

    @staticmethod
    def get_by_id(db: Session, note_id: int):
        return db.query(Note).filter(Note.id == note_id).first()

    @staticmethod
    def create(db: Session, data: NoteCreate):
        note = Note(**data.dict())
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def update(db: Session, note: Note, data: NoteUpdate):
        for key, value in data.dict(exclude_unset=True).items(): 
            setattr(note, key, value)
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def delete(db: Session, note: Note):
        db.delete(note)
        db.commit()

    @staticmethod
    def toggle_archive(db: Session, note: Note, archived: bool):
        note.archived = archived
        db.commit()
        db.refresh(note)
        return note