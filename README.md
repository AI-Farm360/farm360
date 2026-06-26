# Farm360 FieldPulse - Technical Product Documentation & Roadmap

## Executive Summary

Farm360 FieldPulse is an AI-powered satellite monitoring and advisory platform designed to bridge the decision intelligence gap for smallholder potato farmers in Kenya. By transforming complex geospatial and environmental data into localized, actionable recommendations delivered via WhatsApp, SMS, and USSD, the platform enables early intervention, reduces yield losses, and builds trust across the agricultural value chain.

---

## Part 1: Technical Product Documentation

### 1.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE LAYER                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js 15 (TypeScript) + Tailwind CSS + Leaflet + Recharts              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │  Landing     │ │  Dashboard   │ │  Feedback    │ │  Extension      │  │
│  │  Page        │ │  (Farmers)   │ │  Module      │ │  Dashboard      │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────────┘  │
│                           │               │               │                │
│  ┌───────────────────────▼───────────────▼───────────────▼────────────┐  │
│  │                    API Gateway (Next.js API Routes)                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │ HTTPS
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND SERVICES LAYER                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                    FastAPI (Python 3.10+) - Port 8000                     │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  CORS Middleware (Open for dev → Restrict for production)          │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  ROUTERS                                                             │ │
│  │  ┌────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │ │
│  │  │ /fields    │ │ /monitoring │ │ /advisory   │ │ /alerts      │  │ │
│  │  │ Register   │ │ Latest      │ │ Analyze     │ │ Active       │  │ │
│  │  │ List       │ │ History     │ │ History     │ │ Acknowledge  │  │ │
│  │  │ Update     │ └─────────────┘ └─────────────┘ └──────────────┘  │ │
│  │  │ Delete     │                                                    │ │
│  │  └────────────┘ ┌─────────────────────────────────────────────────┐ │ │
│  └─────────────────│  /feedback  │ Submit │ History                 │ │ │
│                    └─────────────────────────────────────────────────┘ │ │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  SERVICES (Future Integration Points Marked with TODOs)             │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │  satellite_service.py    → Mock → Sentinel-2/Landsat (TODO)  │ │ │
│  │  │  weather_service.py      → Mock → Weather API (TODO)         │ │ │
│  │  │  risk_engine.py          → Rule-based → XGBoost (TODO)       │ │ │
│  │  │  advisory_generator.py   → Templates → Llama/Gemini (TODO)   │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  DATA LAYER                                                          │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────────────────┐ │ │
│  │  │ mock_fields.json│  │ mock_history.json│  │ In-Memory (TODO→DB) │ │ │
│  │  └────────────────┘  └────────────────┘  └───────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS (Future)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐ │
│  │ Google Earth      │  │ Weather API       │  │ Africa's Talking API  │ │
│  │ Engine / Copernicus│  │ (OpenWeather,     │  │ (WhatsApp, SMS, USSD) │ │
│  │ (Sentinel-2/      │  │  etc.)            │  │                       │ │
│  │  Landsat)         │  └───────────────────┘  └───────────────────────┘ │
│  └───────────────────┘                                                   │
│  ┌───────────────────┐  ┌───────────────────┐                           │
│  │ Google Gemini /   │  │ PostgreSQL /      │                           │
│  │ Llama (LLM)       │  │ Neo4j (Database)  │                           │
│  └───────────────────┘  └───────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           END-TO-END DATA FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│ 1. FIELD REGISTRATION│
│  ┌────────────────┐ │
│  │ Farmer inputs: │ │
│  │ • Name/Phone   │ │
│  │ • Boundary     │ │
│  │ • Planting Date│ │
│  │ • Variety      │ │
│  │ • Location     │ │
│  └───────┬────────┘ │
└──────────┼──────────┘
           ▼
┌────────────────────┐
│ 2. GROWTH STAGE     │
│    COMPUTATION       │
│  ┌────────────────┐ │
│  │ days = today - │ │
│  │ planting_date  │ │
│  │ ↓              │ │
│  │ 0-30: Emergence│ │
│  │ 30-60: Veg.    │ │
│  │ 60-80: Tuber   │ │
│  │ 80-100: Bulking│ │
│  │ 100+: Maturation│ │
│  └───────┬────────┘ │
└──────────┼──────────┘
           ▼
┌────────────────────────────────────────────────────────────────────┐
│ 3. MONITORING LOOP (Every 3-5 days / On-demand)                   │
│  ┌────────────────────────┐  ┌──────────────────────────────┐    │
│  │ SATELLITE INDICES      │  │ WEATHER PARAMETERS           │    │
│  │ ┌────────────────────┐ │  │ ┌──────────────────────────┐ │    │
│  │ │ NDVI (Vegetation   │ │  │ │ Rainfall (mm)            │ │    │
│  │ │  vigor)            │ │  │ │ Temperature (°C)         │ │    │
│  │ │ NDMI (Moisture)    │ │  │ │ Humidity (%)             │ │    │
│  │ │ EVI (Enhanced)     │ │  │ └──────────────────────────┘ │    │
│  │ └────────────────────┘ │  └──────────────────────────────┘    │
│  └────────────────────────┘                                     │
│              │                          │                         │
│              └──────────┬───────────────┘                         │
│                         ▼                                         │
│              ┌─────────────────────────┐                         │
│              │ Monitoring Reading      │                         │
│              │ (field_id, date, ndvi,  │                         │
│              │  ndmi, evi, rainfall,   │                         │
│              │  temp, humidity)        │                         │
│              └─────────────────────────┘                         │
└────────────────────────────────────────────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│ 4. AI ADVISORY ENGINE (Risk Analysis)                             │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ INPUT:                                                      │  │
│  │ • Growth stage (from field data)                           │  │
│  │ • NDVI, NDMI, EVI (from satellite)                        │  │
│  │ • Rainfall, Temp, Humidity (from weather)                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ RULE-BASED ENGINE (MVP) / ML MODEL (Future)               │  │
│  │ ┌──────────────────────────────────────────────────────┐   │  │
│  │ │ IF NDMI < threshold_{stage} AND rainfall < threshold │   │  │
│  │ │   → water_stress                                     │   │  │
│  │ │ ELIF NDVI < threshold_{stage}                        │   │  │
│  │ │   → nutrient_deficiency / pest_disease               │   │  │
│  │ │ ELSE                                                │   │  │
│  │ │   → healthy                                          │   │  │
│  │ └──────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ OUTPUT:                                                     │  │
│  │ • risk_type: water_stress/nutrient_deficiency/              │  │
│  │             pest_disease/healthy                            │  │
│  │ • risk_score: 0-100                                         │  │
│  │ • confidence: high/medium/low                               │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│ 5. ADVISORY GENERATION                                            │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ risk_type + growth_stage → recommendation template         │  │
│  │                                                             │  │
│  │ Example:                                                    │  │
│  │ "Soil moisture is low for this growth stage.                │  │
│  │  Irrigate within the next 2 days if rainfall does not       │  │
│  │  occur."                                                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ LOCALIZATION (en/sw)                                       │  │
│  │                                                             │  │
│  │ English: "Irrigate within the next 2 days..."              │  │
│  │ Swahili: "Mwagilia ndani ya siku 2 zijazo..."            │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│ 6. ALERT & DELIVERY                                              │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ IF risk_score > high_risk_threshold → ALERT RAISED         │  │
│  │                                                             │  │
│  │ Delivery Channels:                                          │  │
│  │ • Web Dashboard (Real-time UI)                             │  │
│  │ • WhatsApp (Future - Africa's Talking)                     │  │
│  │ • SMS (Future - Africa's Talking)                          │  │
│  │ • USSD (Future - Africa's Talking)                         │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│ 7. FEEDBACK LOOP (Ground Truth Collection)                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Farmer responds:                                            │  │
│  │ • "Was this advisory accurate?" → Yes/No                   │  │
│  │ • "Comment" → e.g., "Confirmed dry soil on inspection"     │  │
│  │                                                             │  │
│  │ → Stored for future model retraining                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 1.3 Key Data Models

#### Field Schema
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

#### Monitoring Reading Schema
```json
{
  "field_id": "f-001",
  "date": "2026-06-25",
  "ndvi": 0.62,    // Normalized Difference Vegetation Index (0-1)
  "ndmi": 0.31,    // Normalized Difference Moisture Index (-1 to 1)
  "evi": 0.48,     // Enhanced Vegetation Index (0-1)
  "rainfall_mm": 4.2,
  "temperature_c": 21.5,
  "humidity_pct": 68
}
```

#### Advisory/Alert Schema
```json
{
  "advisory_id": "adv-022",
  "alert_id": "a-014",
  "field_id": "f-001",
  "date": "2026-06-25",
  "risk_type": "water_stress",
  "risk_score": 72,
  "confidence": "high",
  "recommendation": "Soil moisture is low for this growth stage. Irrigate within the next 2 days if rainfall does not occur.",
  "language": "en",
  "delivery_status": "pending|sent|read|acknowledged"
}
```

#### Feedback Schema
```json
{
  "feedback_id": "fb-003",
  "field_id": "f-001",
  "advisory_id": "adv-022",
  "timestamp": "2026-06-26T10:30:00Z",
  "was_accurate": true,
  "comment": "Confirmed dry soil on inspection."
}
```

---

### 1.4 API Reference Summary

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/fields` | POST | Register new field | None (MVP) |
| `/api/fields` | GET | List all fields | None (MVP) |
| `/api/fields/{field_id}` | GET | Get field details | None (MVP) |
| `/api/fields/{field_id}` | PUT | Update field | None (MVP) |
| `/api/fields/{field_id}` | DELETE | Delete field | None (MVP) |
| `/api/monitoring/{field_id}` | GET | Latest reading | None (MVP) |
| `/api/monitoring/{field_id}/history` | GET | Time-series data | None (MVP) |
| `/api/advisory/{field_id}/analyze` | POST | Run risk analysis | None (MVP) |
| `/api/advisory/{field_id}` | GET | Latest advisory | None (MVP) |
| `/api/advisory/{field_id}/history` | GET | Advisory history | None (MVP) |
| `/api/alerts` | GET | All active alerts | None (MVP) |
| `/api/alerts/{field_id}` | GET | Field alerts | None (MVP) |
| `/api/alerts/{field_id}/acknowledge` | POST | Acknowledge alert | None (MVP) |
| `/api/feedback/{field_id}` | POST | Submit feedback | None (MVP) |
| `/api/feedback/{field_id}` | GET | Feedback history | None (MVP) |
| `/health` | GET | Health check | None |

---

### 1.5 Technology Stack

#### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 15 (App Router) | React framework with SSR/SSG |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Maps | Leaflet + react-leaflet | Interactive farm boundaries |
| Charts | Recharts | Monitoring data visualization |
| Forms | react-hook-form + zod | Form validation |
| Animation | motion + lottie-react | UI polish |
| Icons | lucide-react | Icon library |

#### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| API Framework | FastAPI (Python 3.10+) | REST API with auto-docs |
| Data Validation | Pydantic | Request/response validation |
| Data Storage | JSON files (MVP) → PostgreSQL (Future) | Field data, history |
| ML Framework | Scikit-learn, XGBoost (Future) | Risk classification |
| LLM Integration | Google Gemini API (Future) | Natural language generation |
| Maps API | Google Earth Engine (Future) | Satellite data retrieval |

#### Infrastructure (Future)
| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL + Neo4j | Relational + Graph DB |
| Cloud | AWS/GCP/Azure | Hosting |
| CI/CD | GitHub Actions | Deployment automation |
| Monitoring | Prometheus + Grafana | System health |

---

### 1.6 Future Integration Points (TODOs)

| Component | Current State | Future State | Priority |
|-----------|---------------|--------------|----------|
| **Satellite Data** | Mock NDVI/NDMI/EVI | Sentinel-2/Landsat via GEE | High |
| **Weather Data** | Mock rainfall/temp/humidity | OpenWeather/WeatherAPI | High |
| **Risk Engine** | Rule-based thresholds | XGBoost/Scikit-learn model | High |
| **Advisory Text** | Templated strings | Llama/Gemini generation | Medium |
| **Delivery** | Web only | WhatsApp/SMS/USSD via Africa's Talking | High |
| **Database** | JSON files | PostgreSQL + Neo4j | High |
| **Authentication** | None | Farmer/admin auth | High |

---

## Part 2: Product Roadmap

### 2.1 Hackathon Milestone Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HACKATHON ROADMAP (6-8 Week Sprint)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SPRINT 1 (Week 1-2)    │  SPRINT 2 (Week 3-4)    │  SPRINT 3 (Week 5-6)  │
│  ──────────────────     │  ──────────────────     │  ──────────────────    │
│  Foundation & Setup     │  Core Features          │  Polish & Demo Prep    │
│                         │                         │                         │
│  • Project scaffolding  │  • Advisory engine      │  • UI/UX polish        │
│  • Backend FastAPI      │  • Alert system         │  • Performance opt.    │
│  • Frontend Next.js     │  • Feedback loop        │  • Documentation       │
│  • Field registration   │  • Swahili localization │  • Integration testing │
│  • Monitoring mock      │  • Extension dashboard  │  • Deploy to staging   │
│  • Growth stage calc    │  • "Crop Passport" view │  • Demo video & slides │
│  • Health endpoints     │                         │                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.2 Detailed Sprint Breakdown

#### Sprint 1: Foundation & Core Setup (Weeks 1-2)

**Goal:** Establish project infrastructure and implement basic field registration.

| Task | Description | Owner | Status |
|------|-------------|-------|--------|
| **Backend Foundation** | | | |
| Setup FastAPI project | Create `main.py`, dependency management | Backend | ✅ |
| Configure CORS | Open for development | Backend | ✅ |
| Implement health endpoint | `/health` for monitoring | Backend | ✅ |
| Create Pydantic schemas | `models/schemas.py` | Backend | ✅ |
| **Field Registration** | | | |
| Implement `POST /api/fields` | Register field with boundary | Backend | ✅ |
| Implement `GET /api/fields` | List all fields | Backend | ✅ |
| Implement `GET /api/fields/{id}` | Get single field | Backend | ✅ |
| Implement `PUT /api/fields/{id}` | Update field | Backend | ✅ |
| Implement `DELETE /api/fields/{id}` | Delete field | Backend | ✅ |
| Growth stage computation | Auto-calculate from planting date | Backend | ✅ |
| Mock data storage | JSON file persistence | Backend | ✅ |
| **Frontend Foundation** | | | |
| Next.js project setup | App Router, TypeScript | Frontend | ✅ |
| Tailwind CSS configuration | Styling setup | Frontend | ✅ |
| Landing page | Problem/solution overview | Frontend | ✅ |
| Registration form | Farm boundary with Leaflet | Frontend | ✅ |
| API client setup | React Query or fetch wrapper | Frontend | ✅ |
| **Testing** | | | |
| API tests | Verify field endpoints | QA | Pending |
| Component tests | Verify registration flow | QA | Pending |

**Deliverables:**
- Running FastAPI server with field CRUD operations
- Working registration form with map boundary selection
- Health check endpoint functional

---

#### Sprint 2: Core Features (Weeks 3-4)

**Goal:** Implement monitoring, advisory engine, alerts, and feedback.

| Task | Description | Owner | Status |
|------|-------------|-------|--------|
| **Monitoring** | | | |
| Implement `GET /monitoring/{id}` | Latest reading | Backend | ⏳ |
| Implement `GET /monitoring/{id}/history` | Time-series data | Backend | ⏳ |
| Satellite service mock | Generate NDVI/NDMI/EVI | Backend | ⏳ |
| Weather service mock | Generate rainfall/temp/humidity | Backend | ⏳ |
| **Advisory Engine** | | | |
| Implement `POST /advisory/{id}/analyze` | Risk analysis endpoint | Backend | ⏳ |
| Implement rule-based risk engine | Water stress, nutrient, pest | Backend | ⏳ |
| Implement advisory generator | Template-based recommendations | Backend | ⏳ |
| Implement `GET /advisory/{id}` | Latest advisory | Backend | ⏳ |
| Implement `GET /advisory/{id}/history` | Advisory history | Backend | ⏳ |
| **Alerts** | | | |
| Implement `GET /alerts` | List active alerts | Backend | ⏳ |
| Implement `GET /alerts/{id}` | Field alerts | Backend | ⏳ |
| Implement `POST /alerts/{id}/acknowledge` | Acknowledge alert | Backend | ⏳ |
| Auto-alert triggering | When risk_score > threshold | Backend | ⏳ |
| **Feedback** | | | |
| Implement `POST /feedback/{id}` | Submit feedback | Backend | ⏳ |
| Implement `GET /feedback/{id}` | Feedback history | Backend | ⏳ |
| **Frontend Features** | | | |
| Dashboard layout | Main dashboard page | Frontend | ⏳ |
| Field card component | Display field status | Frontend | ⏳ |
| Monitoring charts | Recharts for NDVI, weather | Frontend | ⏳ |
| Advisory display | Risk badge, recommendation | Frontend | ⏳ |
| Alert bell/notification | Active alerts display | Frontend | ⏳ |
| Feedback form | Was advisory accurate? | Frontend | ⏳ |
| Swahili language toggle | `?language=sw` support | Both | ⏳ |

**Deliverables:**
- End-to-end advisory pipeline: monitoring → analysis → recommendation
- Alert system with acknowledge functionality
- Farmer feedback collection
- Dashboard showing field status, charts, and advisories

---

#### Sprint 3: Polish & Demo Preparation (Weeks 5-6)

**Goal:** Refine UI, add extension dashboard, prepare for demo.

| Task | Description | Owner | Status |
|------|-------------|-------|--------|
| **UI Polish** | | | |
| Mobile responsive design | Optimize for all screen sizes | Frontend | ⏳ |
| Motion animations | Smooth transitions | Frontend | ⏳ |
| Loading states | Skeletons, spinners | Frontend | ⏳ |
| Error handling | User-friendly error messages | Frontend | ⏳ |
| **Extension Staff Dashboard** | | | |
| High-risk field list | Prioritized view | Frontend | ⏳ |
| Map view of alerts | Field boundaries with alert markers | Frontend | ⏳ |
| Extension staff login | Basic auth (MVP) | Backend | ⏳ |
| **Crop Passport View** | | | |
| Field history timeline | Planting to current | Frontend | ⏳ |
| Production verification | Data-backed harvest estimate | Frontend | ⏳ |
| **Infrastructure** | | | |
| Deployment to staging | Render/Heroku/Cloud | DevOps | ⏳ |
| Environment variables | API keys, config | DevOps | ⏳ |
| Error logging | Basic error tracking | Backend | ⏳ |
| **Documentation** | | | |
| Technical documentation | API reference, setup | All | ⏳ |
| User guide | How to use the platform | All | ⏳ |
| **Demo Preparation** | | | |
| Demo script | Walkthrough flow | All | ⏳ |
| Demo video recording | 3-5 minute overview | All | ⏳ |
| Presentation slides | Problem, solution, impact | All | ⏳ |

**Deliverables:**
- Production-ready demo on staging environment
- Comprehensive technical documentation
- Demo video and presentation materials
- Extension staff dashboard for high-risk field prioritization

---

### 2.3 Stretch Goals (If Time Permits)

| Task | Priority | Description |
|------|----------|-------------|
| WhatsApp integration | High | Send advisories via Africa's Talking API |
| SMS delivery | High | Fallback for non-smartphone users |
| USSD integration | Medium | Interactive voice response |
| AI model training | High | Use feedback data for model retraining |
| Gemini LLM integration | Medium | Generate natural language in English/Swahili |
| PostgreSQL database | High | Replace JSON with production DB |
| Authentication | High | Farmer/admin login system |

---

### 2.4 Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Satellite cloud interference** | High | High | Use rainfall anomaly data as proxy; document limitation |
| **Farmer boundary input errors** | Medium | High | Clear instructions; fallback to centroid mapping |
| **Connectivity issues** | Medium | Medium | SMS/USSD fallback; offline-capable dashboard |
| **Data accuracy concerns** | Medium | High | Feedback loop for calibration; transparent confidence scores |
| **Time constraints** | High | High | Focus on core MVP; defer stretch goals |
| **API rate limits** | Low | Medium | Implement caching; batch processing |

---

### 2.5 Success Criteria for Hackathon Judging

| Category | Metric | Target |
|----------|--------|--------|
| **Functionality** | End-to-end user journey | Complete field registration → advisory generation → feedback |
| **Innovation** | AI/ML integration | Rule-based engine with clear path to ML |
| **User Experience** | Intuitive interface | 5-minute onboarding for new farmer |
| **Technical Quality** | Code structure | Clean, documented, scalable code |
| **Impact Potential** | Problem-solution fit | Clear demonstration of value proposition |
| **Presentation** | Pitch quality | Compelling demo + clear business case |

---

## Appendix A: Quick Start Commands

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

### Frontend
```bash
npm install
cp .env.example .env.local
# Set GEMINI_API_KEY in .env.local
npm run dev
# Frontend available at http://localhost:3000
```

---

## Appendix B: Environment Variables

### Frontend (.env.local)
```
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
# Future environment variables
# DATABASE_URL=postgresql://...
# GEE_API_KEY=your_gee_api_key
# WEATHER_API_KEY=your_weather_api_key
# AFRICA_TALKING_API_KEY=...
# LLM_API_KEY=your_llm_api_key
```

---

*This document serves as the technical product documentation and roadmap for Farm360 FieldPulse's submission to the Kenya AI Challenge.*
