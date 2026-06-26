"""Mocked weather service.

TODO (real integration): swap for a real weather API such as
OpenWeather, Tomorrow.io, or the Kenya Meteorological Department feed.
Keep the return shape stable — downstream risk engine depends on it.
"""
from __future__ import annotations

import hashlib
import random
from datetime import datetime

from ..models.schemas import Location, WeatherData


def _rng_for(field_id: str, salt: str = "") -> random.Random:
    h = hashlib.sha256(f"{field_id}:{salt}".encode()).hexdigest()
    return random.Random(int(h[:16], 16))


def get_current_weather(field_id: str, location: Location) -> WeatherData:
    rng = _rng_for(field_id, salt=str(int(datetime.utcnow().timestamp()) // 3600))

    rainfall_mm = max(0.0, rng.gauss(4.0, 4.0))
    # negative anomaly = drier than normal
    rainfall_anomaly_pct = round(rng.gauss(-10.0, 35.0), 1)
    temperature_c = round(rng.gauss(22.0, 3.0), 1)
    humidity_pct = round(max(10.0, min(100.0, rng.gauss(65.0, 12.0))), 1)

    return WeatherData(
        rainfall_mm=round(rainfall_mm, 1),
        rainfall_anomaly_pct=rainfall_anomaly_pct,
        temperature_c=temperature_c,
        humidity_pct=humidity_pct,
    )