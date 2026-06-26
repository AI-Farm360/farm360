from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status

from ..models.schemas import Feedback, FeedbackCreate
from .. import store

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("/{field_id}", response_model=Feedback, status_code=status.HTTP_201_CREATED)
def submit_feedback(field_id: str, payload: FeedbackCreate) -> Feedback:
    if not store.get_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    fb = Feedback(
        id=str(uuid4()),
        field_id=field_id,
        advisory_id=payload.advisory_id,
        detected_condition=payload.detected_condition,
        farmer_confirms=payload.farmer_confirms,
        notes=payload.notes,
        created_at=datetime.now(timezone.utc),
    )
    store.add_feedback(fb)
    return fb


@router.get("/{field_id}", response_model=list[Feedback])
def feedback_history(field_id: str) -> list[Feedback]:
    if not store.get_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    return store.feedback_history(field_id)
