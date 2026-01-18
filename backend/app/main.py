from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from .database import Base, engine
from .rutas import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {
        "message": "Notes API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }