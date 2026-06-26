"""Rule-based risk engine.

This module exposes a single `predict()` function with a clear input/output
contract so a trained ML model (XGBoost / scikit-learn / PyTorch) can be
dropped in later without touching callers.

Input:  satellite indices + weather + growth stage
Output: (risk_type, risk_score 0-100, confidence 0-1)

TODO (real ML): replace the rule block in `predict()` with
`model.predict_proba(features)` once a trained model + feature pipeline exist.
"""
from __future__ import annotations

from typing import Tuple

from ..models.schemas import GrowthStage, RiskType, SatelliteIndices, WeatherData


def predict(
    satellite: SatelliteIndices,
    weather: WeatherData,
    growth_stage: GrowthStage,
) -> Tuple[RiskType, int, float]:
    """Return (risk_type, risk_score, confidence)."""

    ndvi = satellite.ndvi
    ndmi = satellite.ndmi
    evi = satellite.evi
    rain_anom = weather.rainfall_anomaly_pct
    humidity = weather.humidity_pct
    temp = weather.temperature_c

    # --- Water stress: low moisture index + rainfall well below normal ---
    if ndmi < 0.25 and rain_anom < -20:
        score = min(100, int(60 + abs(rain_anom) * 0.5 + (0.25 - ndmi) * 100))
        return ("water_stress", score, 0.78)

    # --- Pest / disease pressure: high humidity + warm temps (late blight risk) ---
    if humidity > 80 and 15 <= temp <= 25 and growth_stage in (
        "Vegetative",
        "Tuber Initiation",
        "Bulking",
    ):
        score = min(100, int(55 + (humidity - 80) * 1.5))
        return ("pest_disease_pressure", score, 0.72)

    # --- Nutrient deficiency: NDVI lower than expected for stage, moisture OK ---
    stage_ndvi_floor = {
        "Emergence": 0.15,
        "Vegetative": 0.45,
        "Tuber Initiation": 0.60,
        "Bulking": 0.68,
        "Maturation": 0.45,
        "Harvest Ready": 0.25,
    }.get(growth_stage, 0.4)

    if ndvi < stage_ndvi_floor and ndmi >= 0.25:
        gap = stage_ndvi_floor - ndvi
        score = min(100, int(45 + gap * 200))
        return ("nutrient_deficiency", score, 0.65)

    # --- Healthy: residual score based on how strong indices are ---
    healthy_score = max(0, int(25 - (ndvi - 0.5) * 40 - (evi - 0.4) * 20))
    return ("healthy", healthy_score, 0.82)