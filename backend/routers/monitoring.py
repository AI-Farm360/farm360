from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from ..models.schemas import MonitoringHistory, MonitoringReading
from ..services import satellite_service, weather_service
from .. import store

router = APIRouter(prefix="/api/monitoring", tags=["monitoring"])


def _build_reading(field_id: str) -> MonitoringReading:
    f = store.get_field(field_id)
    if not f:
        raise HTTPException(status_code=404, detail="Field not found")
    sat = satellite_service.get_latest_indices(field_id, f.growth_stage)
    wx = weather_service.get_current_weather(field_id, f.location)
    return MonitoringReading(
        field_id=field_id,
        timestamp=datetime.now(timezone.utc),
        satellite=sat,
        weather=wx,
        source="mock",
    )


@router.get("/{field_id}", response_model=MonitoringReading)
def get_latest(field_id: str) -> MonitoringReading:
    return _build_reading(field_id)


@router.get("/{field_id}/history", response_model=MonitoringHistory)
def get_history(
    field_id: str,
    count: int = Query(10, ge=1, le=24),
) -> MonitoringHistory:
    f = store.get_field(field_id)
    if not f:
        raise HTTPException(status_code=404, detail="Field not found")

    sat_hist = satellite_service.get_history(field_id, f.growth_stage, count=count)
    readings: list[MonitoringReading] = []
    for ts, sat in sat_hist:
        wx = weather_service.get_current_weather(field_id, f.location)
        readings.append(
            MonitoringReading(
                field_id=field_id,
                timestamp=ts,
                satellite=sat,
                weather=wx,
                source="mock",
            )
        )
    return MonitoringHistory(field_id=field_id, readings=readings)
