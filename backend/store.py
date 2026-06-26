"""In-memory data store for FieldPulse.

No database is used at this stage. State resets on server restart, which is
intentional. Each store is a simple dict keyed by id.

TODO (persistence): swap for Postgres + SQLAlchemy or similar when moving
beyond prototype. Keep the function signatures stable.
"""
from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any
from uuid import uuid4

from .models.schemas import (
    Advisory,
    Alert,
    FieldOut,
    Feedback,
    GrowthStage,
    Location,
    MonitoringReading,
)


# ---------------------------------------------------------------------------
# Growth stage helper
# ---------------------------------------------------------------------------

def compute_growth_stage(planting_date: date) -> tuple[GrowthStage, int]:
    days = (date.today() - planting_date).days
    if days < 0:
        days = 0
    if days < 15:
        stage: GrowthStage = "Emergence"
    elif days < 40:
        stage = "Vegetative"
    elif days < 60:
        stage = "Tuber Initiation"
    elif days < 90:
        stage = "Bulking"
    elif days < 110:
        stage = "Maturation"
    else:
        stage = "Harvest Ready"
    return stage, days


# ---------------------------------------------------------------------------
# Stores
# ---------------------------------------------------------------------------

# field_id -> dict (raw field record)
_fields: dict[str, dict[str, Any]] = {}
# field_id -> list[Advisory]
_advisories: dict[str, list[Advisory]] = {}
# alert_id -> Alert
_alerts: dict[str, Alert] = {}
# field_id -> list[Feedback]
_feedback: dict[str, list[Feedback]] = {}


# ---------------------------------------------------------------------------
# Fields
# ---------------------------------------------------------------------------

def create_field(
    farmer_name: str,
    farmer_phone: str,
    boundary: Any,
    planting_date: date,
    potato_variety: str,
    location: Location,
) -> FieldOut:
    fid = str(uuid4())
    stage, days = compute_growth_stage(planting_date)
    record = {
        "id": fid,
        "farmer_name": farmer_name,
        "farmer_phone": farmer_phone,
        "boundary": boundary,
        "planting_date": planting_date,
        "potato_variety": potato_variety,
        "location": location,
        "created_at": datetime.now(timezone.utc),
    }
    _fields[fid] = record
    return FieldOut(**record, growth_stage=stage, days_since_planting=days)


def get_field(field_id: str) -> FieldOut | None:
    rec = _fields.get(field_id)
    if not rec:
        return None
    stage, days = compute_growth_stage(rec["planting_date"])
    return FieldOut(**rec, growth_stage=stage, days_since_planting=days)


def list_fields() -> list[FieldOut]:
    out = []
    for rec in _fields.values():
        stage, days = compute_growth_stage(rec["planting_date"])
        out.append(FieldOut(**rec, growth_stage=stage, days_since_planting=days))
    return out


def update_field(field_id: str, patch: dict[str, Any]) -> FieldOut | None:
    rec = _fields.get(field_id)
    if not rec:
        return None
    for k, v in patch.items():
        if v is not None:
            rec[k] = v
    stage, days = compute_growth_stage(rec["planting_date"])
    return FieldOut(**rec, growth_stage=stage, days_since_planting=days)


def delete_field(field_id: str) -> bool:
    if field_id not in _fields:
        return False
    _fields.pop(field_id, None)
    _advisories.pop(field_id, None)
    _feedback.pop(field_id, None)
    # Drop alerts tied to that field
    for aid in [a.id for a in _alerts.values() if a.field_id == field_id]:
        _alerts.pop(aid, None)
    return True


def field_raw(field_id: str) -> dict[str, Any] | None:
    return _fields.get(field_id)


# ---------------------------------------------------------------------------
# Advisories
# ---------------------------------------------------------------------------

def add_advisory(adv: Advisory) -> None:
    _advisories.setdefault(adv.field_id, []).append(adv)


def latest_advisory(field_id: str) -> Advisory | None:
    items = _advisories.get(field_id) or []
    return items[-1] if items else None


def advisory_history(field_id: str) -> list[Advisory]:
    return list(_advisories.get(field_id) or [])


# ---------------------------------------------------------------------------
# Alerts
# ---------------------------------------------------------------------------

def add_alert(alert: Alert) -> None:
    _alerts[alert.id] = alert


def all_alerts(active_only: bool = True) -> list[Alert]:
    items = list(_alerts.values())
    if active_only:
        items = [a for a in items if not a.acknowledged]
    return sorted(items, key=lambda a: a.created_at, reverse=True)


def alerts_for_field(field_id: str) -> list[Alert]:
    return sorted(
        [a for a in _alerts.values() if a.field_id == field_id],
        key=lambda a: a.created_at,
        reverse=True,
    )


def acknowledge_alert(field_id: str, alert_id: str | None = None) -> Alert | None:
    target = None
    if alert_id:
        target = _alerts.get(alert_id)
        if target and target.field_id != field_id:
            target = None
    else:
        # ack most recent unacknowledged alert for the field
        candidates = [
            a for a in _alerts.values()
            if a.field_id == field_id and not a.acknowledged
        ]
        candidates.sort(key=lambda a: a.created_at, reverse=True)
        target = candidates[0] if candidates else None
    if not target:
        return None
    target.acknowledged = True
    target.acknowledged_at = datetime.now(timezone.utc)
    return target


# ---------------------------------------------------------------------------
# Feedback
# ---------------------------------------------------------------------------

def add_feedback(fb: Feedback) -> None:
    _feedback.setdefault(fb.field_id, []).append(fb)


def feedback_history(field_id: str) -> list[Feedback]:
    return list(_feedback.get(field_id) or [])
