"""Pydantic v2 schemas for FieldPulse API.

All request/response bodies in the API are defined here so the existing
React/TypeScript client gets a stable, predictable JSON contract.
"""
from __future__ import annotations

from datetime import date, datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field, ConfigDict


# ---------------------------------------------------------------------------
# Shared
# ---------------------------------------------------------------------------

GrowthStage = Literal[
    "Emergence",
    "Vegetative",
    "Tuber Initiation",
    "Bulking",
    "Maturation",
    "Harvest Ready",
]

RiskType = Literal[
    "healthy",
    "water_stress",
    "nutrient_deficiency",
    "pest_disease_pressure",
]

Language = Literal["en", "sw"]


class Location(BaseModel):
    """Simple lat/lng point — county/region is optional metadata."""
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    region: Optional[str] = None
    county: Optional[str] = None


# ---------------------------------------------------------------------------
# Fields
# ---------------------------------------------------------------------------

class FieldCreate(BaseModel):
    farmer_name: str = Field(..., min_length=1, max_length=120)
    farmer_phone: str = Field(..., min_length=6, max_length=20)
    # Accept either a GeoJSON polygon dict OR a simple list of [lng, lat] points.
    boundary: Any = Field(
        ...,
        description="GeoJSON Polygon object OR list of [lng, lat] pairs.",
    )
    planting_date: date
    potato_variety: str = Field(..., min_length=1, max_length=80)
    location: Location


class FieldUpdate(BaseModel):
    farmer_name: Optional[str] = Field(None, min_length=1, max_length=120)
    farmer_phone: Optional[str] = Field(None, min_length=6, max_length=20)
    boundary: Optional[Any] = None
    planting_date: Optional[date] = None
    potato_variety: Optional[str] = None
    location: Optional[Location] = None


class FieldOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    farmer_name: str
    farmer_phone: str
    boundary: Any
    planting_date: date
    potato_variety: str
    location: Location
    growth_stage: GrowthStage
    days_since_planting: int
    created_at: datetime


# ---------------------------------------------------------------------------
# Monitoring
# ---------------------------------------------------------------------------

class SatelliteIndices(BaseModel):
    ndvi: float = Field(..., ge=-1, le=1, description="Vegetation greenness")
    ndmi: float = Field(..., ge=-1, le=1, description="Moisture index")
    evi: float = Field(..., ge=-1, le=1, description="Enhanced vegetation index")


class WeatherData(BaseModel):
    rainfall_mm: float
    rainfall_anomaly_pct: float = Field(
        ..., description="% deviation from seasonal normal (-100..+inf)"
    )
    temperature_c: float
    humidity_pct: float = Field(..., ge=0, le=100)


class MonitoringReading(BaseModel):
    field_id: str
    timestamp: datetime
    satellite: SatelliteIndices
    weather: WeatherData
    source: str = Field(
        default="mock",
        description="Will be 'sentinel-2', 'landsat-8' etc. once real integrations are wired.",
    )


class MonitoringHistory(BaseModel):
    field_id: str
    readings: list[MonitoringReading]


# ---------------------------------------------------------------------------
# Advisory
# ---------------------------------------------------------------------------

class AdvisoryRequest(BaseModel):
    language: Language = "en"


class Advisory(BaseModel):
    id: str
    field_id: str
    timestamp: datetime
    growth_stage: GrowthStage
    risk_type: RiskType
    risk_score: int = Field(..., ge=0, le=100)
    confidence: float = Field(..., ge=0, le=1)
    recommended_action: str
    message: str
    language: Language
    inputs: MonitoringReading


# ---------------------------------------------------------------------------
# Alerts
# ---------------------------------------------------------------------------

AlertSeverity = Literal["low", "medium", "high", "critical"]


class Alert(BaseModel):
    id: str
    field_id: str
    farmer_name: str
    farmer_phone: str
    risk_type: RiskType
    risk_score: int
    severity: AlertSeverity
    message: str
    created_at: datetime
    acknowledged: bool = False
    acknowledged_at: Optional[datetime] = None


class AckResponse(BaseModel):
    ok: bool
    alert: Alert


# ---------------------------------------------------------------------------
# Feedback
# ---------------------------------------------------------------------------

class FeedbackCreate(BaseModel):
    advisory_id: Optional[str] = None
    detected_condition: RiskType
    farmer_confirms: bool
    notes: Optional[str] = Field(None, max_length=1000)


class Feedback(BaseModel):
    id: str
    field_id: str
    advisory_id: Optional[str]
    detected_condition: RiskType
    farmer_confirms: bool
    notes: Optional[str]
    created_at: datetime


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

class Health(BaseModel):
    status: Literal["ok"] = "ok"
    service: str = "fieldpulse-backend"
    time: datetime
