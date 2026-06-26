from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    Advisory,
    AdvisoryRequest,
    Alert,
    AlertSeverity,
    MonitoringReading,
)
from ..services import risk_engine, advisory_generator, satellite_service, weather_service
from .. import store

router = APIRouter(prefix="/api/advisory", tags=["advisory"])


def _severity_for(score: int) -> AlertSeverity:
    if score >= 85:
        return "critical"
    if score >= 70:
        return "high"
    if score >= 50:
        return "medium"
    return "low"


@router.post("/{field_id}/analyze", response_model=Advisory)
def analyze(field_id: str, payload: AdvisoryRequest | None = None) -> Advisory:
    payload = payload or AdvisoryRequest()
    f = store.get_field(field_id)
    if not f:
        raise HTTPException(status_code=404, detail="Field not found")

    sat = satellite_service.get_latest_indices(field_id, f.growth_stage)
    wx = weather_service.get_current_weather(field_id, f.location)
    reading = MonitoringReading(
        field_id=field_id,
        timestamp=datetime.now(timezone.utc),
        satellite=sat,
        weather=wx,
        source="mock",
    )

    risk_type, score, confidence = risk_engine.predict(sat, wx, f.growth_stage)
    action, message = advisory_generator.build_advisory_text(
        risk_type=risk_type,
        risk_score=score,
        growth_stage=f.growth_stage,
        reading=reading,
        variety=f.potato_variety,
        language=payload.language,
    )

    adv = Advisory(
        id=str(uuid4()),
        field_id=field_id,
        timestamp=datetime.now(timezone.utc),
        growth_stage=f.growth_stage,
        risk_type=risk_type,
        risk_score=score,
        confidence=round(confidence, 3),
        recommended_action=action,
        message=message,
        language=payload.language,
        inputs=reading,
    )
    store.add_advisory(adv)

    # Auto-raise an alert for high-risk non-healthy advisories.
    # TODO (delivery): push to WhatsApp / SMS via Twilio or Africa's Talking.
    if risk_type != "healthy" and score >= 50:
        alert = Alert(
            id=str(uuid4()),
            field_id=field_id,
            farmer_name=f.farmer_name,
            farmer_phone=f.farmer_phone,
            risk_type=risk_type,
            risk_score=score,
            severity=_severity_for(score),
            message=message,
            created_at=datetime.now(timezone.utc),
        )
        store.add_alert(alert)

    return adv


@router.get("/{field_id}", response_model=Advisory)
def latest(field_id: str) -> Advisory:
    if not store.get_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    adv = store.latest_advisory(field_id)
    if not adv:
        raise HTTPException(status_code=404, detail="No advisory yet. POST /analyze first.")
    return adv


@router.get("/{field_id}/history", response_model=list[Advisory])
def history(field_id: str) -> list[Advisory]:
    if not store.get_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    return store.advisory_history(field_id)
