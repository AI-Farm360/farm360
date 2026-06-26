"""FieldPulse FastAPI backend.

Run locally:
    pip install -r backend/requirements.txt
    uvicorn backend.main:app --reload

Interactive docs: http://localhost:8000/docs
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models.schemas import Health
from .routers import advisory, alerts, feedback, fields, monitoring

app = FastAPI(
    title="FieldPulse API",
    description=(
        "AI-powered satellite monitoring & advisory backend for smallholder "
        "potato farmers in Kenya. Mocked satellite/weather/ML — no database."
    ),
    version="0.1.0",
)

# CORS: open in dev so the existing React/TS client can call freely.
# TODO (prod): restrict allow_origins to the deployed frontend origin(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fields.router)
app.include_router(monitoring.router)
app.include_router(advisory.router)
app.include_router(alerts.router)
app.include_router(feedback.router)


@app.get("/health", response_model=Health, tags=["meta"])
def health() -> Health:
    return Health(time=datetime.now(timezone.utc))


@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    return {
        "service": "fieldpulse-backend",
        "docs": "/docs",
        "health": "/health",
    }
