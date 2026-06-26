"""Mocked satellite indices service.

TODO (real integration): replace `get_latest_indices` and `get_history` with
calls to Sentinel-2 / Landsat-8 retrieval (e.g. via Sentinel Hub, Google Earth
Engine, or a Copernicus Data Space subscription). The function signatures and
return shapes should stay the same so nothing downstream changes.
"""
from __future__ import annotations

import hashlib
import random
from datetime import datetime, timedelta, timezone

from ..models.schemas import SatelliteIndices


def _seeded_rng(field_id: str, offset: int = 0) -> random.Random:
    """Deterministic-ish RNG per field so repeated calls feel stable."""
    h = hashlib.sha256(f"{field_id}:{offset}".encode()).hexdigest()
    return random.Random(int(h[:16], 16))


def get_latest_indices(field_id: str, growth_stage: str) -> SatelliteIndices:
    rng = _seeded_rng(field_id, offset=int(datetime.utcnow().timestamp()) // 3600)

    # Healthy potato NDVI tends to peak during Bulking.
    stage_bias = {
        "Emergence": 0.25,
        "Vegetative": 0.55,
        "Tuber Initiation": 0.70,
        "Bulking": 0.78,
        "Maturation": 0.55,
        "Harvest Ready": 0.35,
    }.get(growth_stage, 0.5)

    ndvi = max(-1.0, min(1.0, rng.gauss(stage_bias, 0.08)))
    ndmi = max(-1.0, min(1.0, rng.gauss(stage_bias - 0.15, 0.10)))
    evi = max(-1.0, min(1.0, rng.gauss(stage_bias - 0.05, 0.08)))

    return SatelliteIndices(
        ndvi=round(ndvi, 3),
        ndmi=round(ndmi, 3),
        evi=round(evi, 3),
    )


def get_history(
    field_id: str, growth_stage: str, count: int = 10
) -> list[tuple[datetime, SatelliteIndices]]:
    """Return `count` past readings spaced ~5 days apart."""
    now = datetime.now(timezone.utc).replace(microsecond=0)
    history: list[tuple[datetime, SatelliteIndices]] = []
    for i in range(count, 0, -1):
        ts = now - timedelta(days=i * 5)
        rng = _seeded_rng(field_id, offset=i)
        stage_bias = 0.6 + rng.uniform(-0.15, 0.15)
        history.append(
            (
                ts,
                SatelliteIndices(
                    ndvi=round(max(-1.0, min(1.0, rng.gauss(stage_bias, 0.08))), 3),
                    ndmi=round(max(-1.0, min(1.0, rng.gauss(stage_bias - 0.15, 0.10))), 3),
                    evi=round(max(-1.0, min(1.0, rng.gauss(stage_bias - 0.05, 0.08))), 3),
                ),
            )
        )
    return history
