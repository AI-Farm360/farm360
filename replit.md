# FieldPulse

AI-powered satellite advisory app for smallholder potato farmers in Kenya — delivers moisture, blight, and weather risk alerts in English and Swahili.

---

## Team Structure — Where to Work

```
repo/
├── backend/              ← BACKEND TEAM (Python / FastAPI)
│   ├── routers/          ← API route handlers (advisory, fields, alerts, feedback, monitoring)
│   ├── services/         ← Core logic (satellite_service, risk_engine, advisory_generator, weather_service)
│   ├── models/schemas.py ← Pydantic data models
│   ├── store.py          ← In-memory data store
│   └── main.py           ← FastAPI app entry point
│
└── artifacts/fieldpulse/ ← FRONTEND TEAM (React + Vite + TypeScript)
    └── src/
        ├── components/   ← All UI components (AdvisoryCard, ChatBox, SatelliteFlow, etc.)
        ├── pages/        ← Route pages (dashboard, home, register, feedback)
        ├── data/         ← API contract types + mock data
        ├── contexts/     ← React context (DashboardContext)
        ├── lib/api.ts    ← API client — update base URL here to point at backend
        └── index.css     ← Brand theme (green palette, Inter font)
```

> **Note:** `artifacts/api-server/` is a lightweight Node.js/Express shim used only for the AI chat endpoint. The main backend is the Python FastAPI server in `backend/`.

---

## Running Locally

### Backend (Python)
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
# Health:   http://localhost:8000/health
```

### Frontend (React + Vite)
```bash
pnpm --filter @workspace/fieldpulse run dev
# App: http://localhost:24796  (or $PORT in Replit)
```

### AI Chat API (Node.js — optional)
```bash
pnpm --filter @workspace/api-server run dev
# Runs on port 8080, requires OPENAI_API_KEY secret
```

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS, wouter (routing) |
| Backend | Python 3, FastAPI, Pydantic v2, Uvicorn |
| AI chat | Node.js, Express 5, OpenAI SDK (gpt-4o-mini) |
| Satellite data | Mocked in `backend/services/satellite_service.py` (real integration TBD) |

---

## Connecting Frontend to Backend

In `artifacts/fieldpulse/src/lib/api.ts` — set the base URL to wherever the FastAPI server is running:

```ts
const BASE_URL = 'http://localhost:8000'; // local dev
// or your deployed backend URL in production
```

Currently the frontend runs in **demo mode** using mock data from `src/data/mockData.ts`. To switch to the live API, update the fetch calls in `lib/api.ts` to hit the FastAPI endpoints.

---

## Backend API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/fields` | List farmer's fields |
| GET | `/monitoring/{field_id}` | Satellite + weather metrics |
| GET | `/advisory/{field_id}` | AI-generated risk advisory |
| GET | `/alerts` | Active alerts |
| POST | `/feedback` | Submit farmer feedback |

Full interactive docs at `http://localhost:8000/docs` when backend is running.

---

## Where things live

- **Brand theme:** `artifacts/fieldpulse/src/index.css`
- **API contract types:** `artifacts/fieldpulse/src/data/apiContract.ts`
- **Mock data:** `artifacts/fieldpulse/src/data/mockData.ts`
- **Risk logic:** `backend/services/risk_engine.py`
- **Satellite service:** `backend/services/satellite_service.py`
- **Advisory generator:** `backend/services/advisory_generator.py`

---

## Gotchas

- Frontend currently runs with `?demo=true` query param to use mock data — remove this when wiring to the real backend
- The Python backend uses relative imports (`from .routers import ...`) — always run it from the repo root as a module: `uvicorn backend.main:app`, not `python backend/main.py`
- CORS is open (`*`) in dev — lock it down before production deployment
- `OPENAI_API_KEY` secret is required for the AI chat endpoint; without it the chat falls back to smart mock responses

---

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
