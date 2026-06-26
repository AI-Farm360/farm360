"""Turn risk-engine output into farmer-readable advice.

For now this uses simple templated strings in English and a stubbed Swahili
translation. The `language` parameter is plumbed end-to-end so a real LLM
call (e.g. Llama 3 via an inference endpoint) can be dropped in here later
to produce culturally-appropriate, conversational guidance.

TODO (LLM): replace `_render_message` with a call to an LLM, passing
risk_type, risk_score, growth_stage, and the raw monitoring inputs.
"""
from __future__ import annotations

from ..models.schemas import GrowthStage, Language, MonitoringReading, RiskType


_ACTIONS: dict[RiskType, str] = {
    "healthy": "Continue current management. Keep monitoring weekly.",
    "water_stress": "Irrigate within the next 24-48 hours if possible; mulch to retain moisture.",
    "nutrient_deficiency": "Apply a balanced NPK top-dress; consider foliar feed if symptoms persist.",
    "pest_disease_pressure": "Scout the field for late blight; apply preventive fungicide if conditions persist.",
}


_TEMPLATES_EN: dict[RiskType, str] = {
    "healthy": (
        "Your {variety} field is looking healthy at the {stage} stage. "
        "Greenness (NDVI {ndvi}) and moisture (NDMI {ndmi}) are within normal range."
    ),
    "water_stress": (
        "Your field shows signs of water stress at the {stage} stage. "
        "Moisture index (NDMI {ndmi}) is low and rainfall is {rain_anom}% below normal. "
        "Risk score: {score}/100."
    ),
    "nutrient_deficiency": (
        "Vegetation greenness (NDVI {ndvi}) is below what is expected for the {stage} stage, "
        "which usually points to a nutrient gap. Risk score: {score}/100."
    ),
    "pest_disease_pressure": (
        "Warm, humid conditions ({temp}C, {humidity}% humidity) at the {stage} stage favour "
        "late blight and other potato diseases. Risk score: {score}/100."
    ),
}


# Lightweight Swahili stub. TODO: replace with proper localization or LLM.
_TEMPLATES_SW: dict[RiskType, str] = {
    "healthy": "Shamba lako la {variety} liko vizuri katika hatua ya {stage}. Endelea kufuatilia kila wiki.",
    "water_stress": "Shamba lako linaonyesha dalili za upungufu wa maji katika hatua ya {stage}. Mwagilia maji haraka iwezekanavyo. Hatari: {score}/100.",
    "nutrient_deficiency": "Kijani cha mimea (NDVI {ndvi}) kiko chini ya kawaida kwa hatua ya {stage}. Weka mbolea ya NPK. Hatari: {score}/100.",
    "pest_disease_pressure": "Hali ya hewa yenye joto na unyevu inaweza kusababisha magonjwa ya viazi katika hatua ya {stage}. Hatari: {score}/100.",
}


def _render_message(
    risk_type: RiskType,
    risk_score: int,
    growth_stage: GrowthStage,
    reading: MonitoringReading,
    variety: str,
    language: Language,
) -> str:
    tmpl = (_TEMPLATES_SW if language == "sw" else _TEMPLATES_EN)[risk_type]
    return tmpl.format(
        variety=variety,
        stage=growth_stage,
        ndvi=reading.satellite.ndvi,
        ndmi=reading.satellite.ndmi,
        evi=reading.satellite.evi,
        rain_anom=reading.weather.rainfall_anomaly_pct,
        temp=reading.weather.temperature_c,
        humidity=reading.weather.humidity_pct,
        score=risk_score,
    )


def build_advisory_text(
    risk_type: RiskType,
    risk_score: int,
    growth_stage: GrowthStage,
    reading: MonitoringReading,
    variety: str,
    language: Language = "en",
) -> tuple[str, str]:
    """Return (recommended_action, farmer_message)."""
    action = _ACTIONS[risk_type]
    message = _render_message(
        risk_type, risk_score, growth_stage, reading, variety, language
    )
    return action, message