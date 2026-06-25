# FieldPulse Backend

AI-powered satellite monitoring and advisory backend for smallholder potato farmers in Kenya. Built with **Python + FastAPI**. Part of Team Farm360's submission to the Kenya AI Challenge.

This backend serves the existing `client` (React/TypeScript) frontend in this repo. It currently uses **mocked data only** — no database, no real satellite/weather API calls, no trained ML model yet. All of these are clearly marked as future integration points in the code.

---

## 1. Setup

### Requirements
- Python 3.10+
- pip

### Install & run

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive API docs (Swagger UI): `http://localhost:8000/docs`
Alternative docs (ReDoc): `http://localhost:8000/redoc`

### Health check

```
GET /health
```
Returns `{"status": "ok"}` — use this to confirm the server is running.

---

## 2. Project structure

```
backend/
  main.py                      # FastAPI app entrypoint, CORS, router registration
  routers/
    fields.py                  # Field registration endpoints
    monitoring.py              # Satellite & weather monitoring endpoints
    advisory.py                # AI advisory engine endpoints
    alerts.py                  # Early-warning alert endpoints
    feedback.py                # Farmer feedback endpoints
  models/
    schemas.py                 # Pydantic request/response models
  services/
    satellite_service.py       # Mocked NDVI/NDMI/EVI generation (Sentinel-2/Landsat stand-in)
    weather_service.py         # Mocked weather data (rainfall, temp, humidity)
    risk_engine.py              # Rule-based risk scoring (XGBoost/Scikit-learn stand-in)
    advisory_generator.py      # Converts risk output into farmer-readable advisory text
  data/
    mock_fields.json           # In-memory/JSON mock data store
    mock_history.json
  requirements.txt
```

There is **no database** at this stage. Data lives in memory or in the JSON files under `data/`, and resets when the server restarts.

---

## 3. Core concepts

| Concept | Description |
|---|---|
| **Field** | A farmer's registered potato plot — boundary, planting date, variety, growth stage. |
| **Growth stage** | Auto-computed from days since planting (Emergence → Vegetative → Tuber Initiation → Bulking → Maturation). |
| **Monitoring reading** | A snapshot of NDVI, NDMI, EVI and weather parameters for a field at a point in time. |
| **Advisory** | The output of the risk engine — a risk classification (water stress / nutrient deficiency / pest-disease / healthy), a 0–100 risk score, a confidence level, and farmer-facing recommendation text. |
| **Alert** | Raised automatically when a field's risk score crosses a high-risk threshold. |
| **Feedback** | Farmer's confirmation of whether a past advisory was accurate — stored for future model retraining. |

---

## 4. API Reference

All responses are JSON. All dates are ISO 8601 strings (`YYYY-MM-DD`).

### 4.1 Fields — `/api/fields`

**Register a field**
```
POST /api/fields
```
Request body:
```json
{
  "farmer_name": "Jane Wanjiru",
  "phone_number": "+254712345678",
  "boundary": [[36.821, -1.292], [36.823, -1.292], [36.823, -1.294], [36.821, -1.294]],
  "planting_date": "2026-04-15",
  "variety": "Shangi",
  "location": "Nyandarua County"
}
```
Response:
```json
{
  "field_id": "f-001",
  "farmer_name": "Jane Wanjiru",
  "phone_number": "+254712345678",
  "boundary": [[36.821, -1.292], [36.823, -1.292], [36.823, -1.294], [36.821, -1.294]],
  "planting_date": "2026-04-15",
  "variety": "Shangi",
  "location": "Nyandarua County",
  "growth_stage": "Vegetative",
  "days_since_planting": 71
}
```

**List all fields**
```
GET /api/fields
```

**Get one field**
```
GET /api/fields/{field_id}
```

**Update a field**
```
PUT /api/fields/{field_id}
```

**Delete a field**
```
DELETE /api/fields/{field_id}
```

---

### 4.2 Monitoring — `/api/monitoring`

**Latest satellite + weather reading**
```
GET /api/monitoring/{field_id}
```
Response:
```json
{
  "field_id": "f-001",
  "date": "2026-06-25",
  "ndvi": 0.62,
  "ndmi": 0.31,
  "evi": 0.48,
  "rainfall_mm": 4.2,
  "temperature_c": 21.5,
  "humidity_pct": 68
}
```

**Time-series history (for charts)**
```
GET /api/monitoring/{field_id}/history
```
Response: array of the same shape as above, most recent last.

> NDVI/NDMI/EVI and weather values are currently simulated in `satellite_service.py` / `weather_service.py`. Swap in real Sentinel-2/Landsat retrieval and a weather API here later.

---

### 4.3 Advisory — `/api/advisory`

**Run analysis on a field**
```
POST /api/advisory/{field_id}/analyze
```
Triggers the risk engine using the field's growth stage and latest monitoring data.

Response:
```json
{
  "field_id": "f-001",
  "date": "2026-06-25",
  "risk_type": "water_stress",
  "risk_score": 72,
  "confidence": "high",
  "recommendation": "Soil moisture is low for this growth stage. Irrigate within the next 2 days if rainfall does not occur.",
  "language": "en"
}
```

**Get latest advisory**
```
GET /api/advisory/{field_id}?language=en
```
`language` accepts `en` or `sw` (Swahili — currently templated text; real LLM translation is a future integration point).

**Advisory history**
```
GET /api/advisory/{field_id}/history
```

> `risk_engine.py` is rule-based for now (e.g. low NDMI + low rainfall → water stress) but exposes a `predict(input: dict) -> dict` function with a fixed contract, so a trained XGBoost/Scikit-learn model can be swapped in without changing the API layer.

---

### 4.4 Alerts — `/api/alerts`

**All active alerts**
```
GET /api/alerts
```

**Alerts for one field**
```
GET /api/alerts/{field_id}
```

**Acknowledge an alert**
```
POST /api/alerts/{field_id}/acknowledge
```
Body:
```json
{ "alert_id": "a-014" }
```

---

### 4.5 Feedback — `/api/feedback`

**Submit feedback**
```
POST /api/feedback/{field_id}
```
Body:
```json
{
  "advisory_id": "adv-022",
  "was_accurate": true,
  "comment": "Confirmed dry soil on inspection."
}
```

**Feedback history for a field**
```
GET /api/feedback/{field_id}
```

---

## 5. Error handling

| Status | Meaning |
|---|---|
| `404` | Resource (field, advisory, alert) not found |
| `422` | Validation error (bad request body) |
| `500` | Unexpected server error |

---

## 6. Future integration points (clearly marked as TODOs in code)

- **Real satellite data**: replace `satellite_service.py` mock with Sentinel-2/Landsat retrieval (e.g. via Google Earth Engine or Copernicus Open Access Hub).
- **Real weather data**: replace `weather_service.py` mock with a live weather API.
- **Trained ML model**: replace the rule-based logic in `risk_engine.py` with a trained XGBoost/Scikit-learn model behind the same `predict()` contract.
- **LLM-generated advisory text**: replace templated strings in `advisory_generator.py` with Llama-based generation for natural English/Swahili phrasing.
- **WhatsApp/SMS delivery**: add an outbound delivery service (e.g. Twilio or Africa's Talking) for the advisory delivery channel described in the project proposal.
- **Database**: introduce persistent storage (e.g. PostgreSQL) once the in-memory/JSON mock stage is no longer sufficient.
- **Authentication**: add farmer/admin auth before any production deployment.

---

## 7. CORS

CORS is currently open to all origins (`allow_origins=["*"]`) for development convenience. Restrict this to your deployed frontend's domain before going to production.
