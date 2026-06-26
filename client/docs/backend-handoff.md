# Backend Handoff — Farm360 / FieldPulse

## How to run the frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Expected backend base URL

The frontend reads from the environment variable:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

See `.env.example` in the project root.

## Pages needing API integration

| Page / Route | Current Data Source | Needs API |
|---|---|---|
| `/register` | localStorage + mock | `POST /farmers`, `POST /fields` |
| `/dashboard` | `mock.advisory`, `mock.weather` | `GET /fields/{fieldId}/analysis` |
| `/dashboard/advisories` | `mock.advisory`, `mock.historicalAdvisories` | `GET /fields/{fieldId}/advisories` |
| `/dashboard/fields` | `DashboardContext` fields array | `GET /fields/{fieldId}` |
| `/dashboard/satellite-data` | inline hardcoded `observations` array | `GET /fields/{fieldId}/analysis` |
| `/dashboard/weather` | `mock.weather`, inline hardcoded forecast/rainfall | `GET /fields/{fieldId}/analysis` |
| `/dashboard/notifications` | `fieldpulse_notifications` localStorage | `GET /notifications`, `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all` |
| `/dashboard/feedback` | localStorage | `POST /feedback` |
| `/dashboard/settings` | localStorage | `PATCH /farmers/{id}` (future) |

## Mock data files to replace

| File | Purpose |
|---|---|
| `src/data/apiContract.ts` | Type definitions and example payloads — **keep types, remove examples when API is live** |
| `src/data/mockData.ts` | Exports mock objects consumed by pages — **replace with real API calls via `src/lib/api.ts`** |
| `src/lib/api.ts` | API layer with placeholder fetch functions — **swap BASE to real URL** |

## API endpoints expected

See `docs/api-contract.md` for full request/response schemas.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/farmers` | Register farmer |
| `POST` | `/fields` | Register field |
| `GET` | `/fields/{fieldId}` | Get field profile |
| `GET` | `/fields/{fieldId}/analysis` | Get satellite + weather analysis |
| `GET` | `/fields/{fieldId}/advisories` | Get advisory list |
| `POST` | `/advisories/{advisoryId}/chat` | Ask advisory question |
| `GET` | `/notifications` | Get notifications |
| `PATCH` | `/notifications/{notificationId}/read` | Mark notification read |
| `PATCH` | `/notifications/read-all` | Mark all notifications read |
| `POST` | `/feedback` | Submit feedback |

## Known limitations

- **Registration data is saved to localStorage only** (`fieldpulse_registration` key). The backend must persist this and return a farmer ID.
- **Notifications are managed in localStorage** (`fieldpulse_notifications` key). The backend must serve and persist notifications.
- **Feedback is saved to localStorage** (`fieldpulse_feedback` key). The backend must accept feedback via `POST /feedback`.
- **Chat responses are hardcoded mock strings** in `ChatBox.tsx`. The backend must implement `POST /advisories/{advisoryId}/chat`.
- **Field boundary** is saved manually during registration via map interaction; backend should accept `boundary` as `[[lat,lng],...]` polygon array.
- **Demo mode** (`?demo=true` query param) lets users browse without registration. The backend should optionally support a demo endpoint or return seeded mock data.

## What is frontend-only for now

- All visualizations, animations, and layout components (DashboardPreview, SatelliteFlow, FieldHealthMap, etc.)
- Custom Select component replacing native `<select>`
- Field Map with Leaflet (free, no API key)
- NotificationBell with badge animation
- ChatBox UI (typing indicator, quick questions, Swahili detection)
- Responsive mobile sidebar
- Landing page with marketing visuals

## TypeScript

Run type checking:

```bash
npx tsc --noEmit
```

Shared types are in:
- `src/data/apiContract.ts` — API request/response shapes + example data
- `src/types/api.ts` — Frontend-specific convenience types
