from fastapi import APIRouter
from .controllers.notas_controller import router as note_router

api_router = APIRouter()
api_router.include_router(note_router)
