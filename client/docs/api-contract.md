# Farm360 API Contract

> Base URL: `http://localhost:8000`
> Expected in `.env` as `NEXT_PUBLIC_API_URL`

---

## POST /farmers

**Purpose:** Register a new farmer.

**Request:**
```json
{
  "name": "John Mwangi",
  "phone": "+254712345678",
  "county": "Nyandarua",
  "subCounty": "Ol Kalou",
  "ward": "Kaimbaga",
  "variety": "Shangi",
  "plantingDate": "2026-05-12",
  "farmSize": 3.5,
  "latitude": "-0.2643",
  "longitude": "36.3789",
  "notes": "Clay-loam soil"
}
```

**Response: `201 Created`**
```json
{
  "id": "farmer-001",
  "name": "John Mwangi",
  "phone": "+254712345678",
  "county": "Nyandarua",
  "subCounty": "Ol Kalou",
  "ward": "Kaimbaga",
  "farmSize": 3.5,
  "variety": "Shangi",
  "plantingDate": "2026-05-12",
  "latitude": "-0.2643",
  "longitude": "36.3789",
  "notes": "Clay-loam soil",
  "registeredAt": "2026-05-10T08:30:00Z"
}
```

**Frontend page:** `/register`

---

## POST /fields

**Purpose:** Register a new field for monitoring.

**Request:**
```json
{
  "farmerId": "farmer-001",
  "name": "Nyandarua Shangi Field",
  "county": "Nyandarua",
  "subCounty": "Ol Kalou",
  "ward": "Kaimbaga",
  "variety": "Shangi",
  "plantingDate": "2026-05-12",
  "farmSize": 3.5,
  "latitude": "-0.2643",
  "longitude": "36.3789"
}
```

**Response: `201 Created`**
```json
{
  "id": "field-001",
  "farmerId": "farmer-001",
  "name": "Nyandarua Shangi Field",
  "county": "Nyandarua",
  "subCounty": "Ol Kalou",
  "ward": "Kaimbaga",
  "variety": "Shangi",
  "plantingDate": "2026-05-12",
  "farmSize": 3.5,
  "status": "Healthy",
  "riskScore": 24,
  "confidence": 91,
  "rainfall": 12,
  "latitude": "-0.2643",
  "longitude": "36.3789",
  "createdAt": "2026-05-10T08:35:00Z"
}
```

**Frontend pages:** `/register`, `/dashboard/fields`, `/dashboard/layout` (Add Field modal)

---

## GET /fields/{fieldId}

**Purpose:** Get field profile and latest status.

**Response:**
```json
{
  "id": "field-001",
  "farmerId": "farmer-001",
  "name": "Nyandarua Shangi Field",
  "county": "Nyandarua",
  "subCounty": "Ol Kalou",
  "ward": "Kaimbaga",
  "variety": "Shangi",
  "plantingDate": "2026-05-12",
  "farmSize": 3.5,
  "status": "Healthy",
  "riskScore": 24,
  "confidence": 91,
  "rainfall": 12,
  "latitude": "-0.2643",
  "longitude": "36.3789",
  "createdAt": "2026-05-10T08:35:00Z"
}
```

**Frontend pages:** `/dashboard`, `/dashboard/fields`

---

## GET /fields/{fieldId}/analysis

**Purpose:** Get latest satellite + weather analysis for a field.

**Response:**
```json
{
  "fieldId": "field-001",
  "analyzedAt": "2026-06-25T06:15:00Z",
  "indices": [
    { "index": "NDVI", "value": 0.72, "label": "NDVI", "description": "Vegetation vigor is stable" },
    { "index": "NDMI", "value": 0.41, "label": "NDMI", "description": "Moisture is moderate" },
    { "index": "EVI", "value": 0.58, "label": "EVI", "description": "Canopy structure is sound" }
  ],
  "weather": {
    "temperatureCelsius": 18,
    "humidityPercent": 72,
    "rainfallMm": 12,
    "forecast": "Light rain expected tomorrow"
  },
  "riskScore": 24,
  "confidence": 91
}
```

**Frontend pages:** `/dashboard`, `/dashboard/satellite-data`, `/dashboard/weather`

---

## GET /fields/{fieldId}/advisories

**Purpose:** Get advisory list for a field (current + historical).

**Response:**
```json
{
  "current": {
    "id": "adv-20260625-001",
    "title": "Moisture Stress Watch",
    "severity": "Medium",
    "confidence": 91,
    "recommendation": "Moisture levels are dropping slightly. Inspect soil moisture within 24 hours. If irrigation is available, water the affected section and monitor over the next three days.",
    "swahiliTranslation": "Ushauri wa Kilimo cha Kidijitali",
    "triggeredBy": "NDMI drop below 0.45 threshold",
    "createdAt": "2026-06-25T08:00:00Z"
  },
  "history": [
    {
      "id": "hist-001",
      "title": "Soil Blight Pre-warning",
      "description": "Favorable humidity detected. Inspect low spots for fungal spotting.",
      "severity": "High",
      "confidence": 89,
      "status": "Delivered",
      "date": "Jun 20, 2026"
    }
  ]
}
```

**Frontend page:** `/dashboard/advisories`

---

## POST /advisories/{advisoryId}/chat

**Purpose:** Ask a question about an advisory.

**Request:**
```json
{
  "message": "What does moisture stress mean?",
  "language": "en",
  "fieldId": "field-001"
}
```

**Response:**
```json
{
  "reply": "Moisture stress means your potato crop may not be getting enough water...",
  "sources": ["NDMI dropped below 0.45", "Rainfall 40% below average", "Crop stage: Vegetative"],
  "confidence": 91
}
```

**Frontend component:** `ChatBox.tsx` (inside `/dashboard/advisories`)

---

## GET /notifications

**Purpose:** Get all in-app notifications for the farmer.

**Response:**
```json
[
  {
    "id": "notif-001",
    "type": "advisory",
    "priority": "medium",
    "status": "unread",
    "title": "Moisture Stress Watch",
    "message": "Inspect soil moisture within 24 hours.",
    "fieldId": "field-001",
    "fieldName": "Nyandarua Shangi Field",
    "actionLabel": "View Advisory",
    "actionHref": "/dashboard/advisories",
    "createdAt": "2026-06-25T14:29:00+03:00"
  }
]
```

**Frontend pages:** `/dashboard/notifications`, NotificationBell (header), sidebar badge

---

## PATCH /notifications/{notificationId}/read

**Purpose:** Mark a single notification as read.

**Response:**
```json
{ "success": true }
```

**Frontend component:** `NotificationCard.tsx`

---

## PATCH /notifications/read-all

**Purpose:** Mark all notifications as read.

**Response:**
```json
{ "success": true }
```

**Frontend component:** NotificationBell dropdown, Notifications page header.

---

## POST /feedback

**Purpose:** Submit farmer ground-truth feedback on an advisory.

**Request:**
```json
{
  "advisoryId": "adv-20260625-001",
  "fieldId": "field-001",
  "farmerId": "farmer-001",
  "rating": "yes",
  "notes": "Observed dry soil spots near the ridge. Irrigation was applied manually."
}
```

**Response: `201 Created`**
```json
{
  "id": "fb-20260625-001",
  "advisoryId": "adv-20260625-001",
  "fieldId": "field-001",
  "farmerId": "farmer-001",
  "rating": "yes",
  "notes": "Observed dry soil spots near the ridge. Irrigation was applied manually.",
  "submittedAt": "2026-06-25T14:30:00Z",
  "acknowledged": true
}
```

**Frontend pages:** `/dashboard/feedback`, `/feedback` (landing page)
