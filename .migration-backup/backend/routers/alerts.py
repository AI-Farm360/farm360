from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..models.schemas import AckResponse, Alert
from .. import store

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=list[Alert])
def list_alerts(active_only: bool = Query(True)) -> list[Alert]:
    return store.all_alerts(active_only=active_only)


@router.get("/{field_id}", response_model=list[Alert])
def alerts_for_field(field_id: str) -> list[Alert]:
    if not store.get_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    return store.alerts_for_field(field_id)


@router.post("/{field_id}/acknowledge", response_model=AckResponse)
def acknowledge(
    field_id: str,
    alert_id: Optional[str] = Query(None, description="Specific alert id; defaults to most recent."),
) -> AckResponse:
    if not store.get_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    alert = store.acknowledge_alert(field_id, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="No matching alert to acknowledge")
    return AckResponse(ok=True, alert=alert)
