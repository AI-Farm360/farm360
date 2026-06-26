// ============================================================
// Farm360 API Contracts — Types & Example Payloads
// ============================================================

// --------------- Notification ---------------

export type NotificationType = "advisory" | "weather" | "satellite" | "feedback" | "system";

export type NotificationStatus = "unread" | "read";

export type NotificationPriority = "low" | "medium" | "high";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  fieldId: string;
  fieldName: string;
  actionLabel: string;
  actionHref: string;
  createdAt: string;
}

export interface CreateNotificationPayload {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  fieldId: string;
  actionLabel: string;
  actionHref: string;
}

export const exampleNotifications: NotificationResponse[] = [
  {
    id: "notif-001",
    type: "advisory",
    priority: "medium",
    status: "unread",
    title: "Moisture Stress Watch",
    message: "Inspect soil moisture within 24 hours. Moisture levels are dropping slightly.",
    fieldId: "field-001",
    fieldName: "Nyandarua Shangi Field",
    actionLabel: "View Advisory",
    actionHref: "/dashboard/advisories",
    createdAt: "2026-06-25T14:29:00+03:00"
  },
  {
    id: "notif-002",
    type: "weather",
    priority: "high",
    status: "unread",
    title: "Heavy Rain Risk",
    message: "Rainfall may increase disease pressure. Inspect drainage and lower leaves.",
    fieldId: "field-001",
    fieldName: "Nyandarua Shangi Field",
    actionLabel: "View Weather",
    actionHref: "/dashboard/weather",
    createdAt: "2026-06-25T10:00:00+03:00"
  },
  {
    id: "notif-003",
    type: "satellite",
    priority: "low",
    status: "read",
    title: "New Satellite Observation",
    message: "A new Sentinel-2 pass has been processed for your field.",
    fieldId: "field-001",
    fieldName: "Nyandarua Shangi Field",
    actionLabel: "View Satellite Data",
    actionHref: "/dashboard/satellite-data",
    createdAt: "2026-06-24T16:40:00+03:00"
  },
  {
    id: "notif-004",
    type: "feedback",
    priority: "medium",
    status: "unread",
    title: "Confirm Field Condition",
    message: "Was the moisture stress advisory accurate for your field?",
    fieldId: "field-001",
    fieldName: "Nyandarua Shangi Field",
    actionLabel: "Give Feedback",
    actionHref: "/dashboard/feedback",
    createdAt: "2026-06-25T15:15:00+03:00"
  },
];

// --------------- Farmer ---------------

export interface CreateFarmerPayload {
  name: string;
  phone: string;
  county: string;
  subCounty: string;
  ward: string;
  variety: string;
  plantingDate: string;
  farmSize: number;
  latitude?: string;
  longitude?: string;
  notes?: string;
}

export interface FarmerResponse {
  id: string;
  name: string;
  phone: string;
  county: string;
  subCounty: string;
  ward: string;
  farmSize: number;
  variety: string;
  plantingDate: string;
  latitude: string | null;
  longitude: string | null;
  notes: string | null;
  registeredAt: string;
}

export const exampleCreateFarmerPayload: CreateFarmerPayload = {
  name: "John Mwangi",
  phone: "+254712345678",
  county: "Nyandarua",
  subCounty: "Ol Kalou",
  ward: "Kaimbaga",
  variety: "Shangi",
  plantingDate: "2026-05-12",
  farmSize: 3.5,
  latitude: "-0.2643",
  longitude: "36.3789",
  notes: "No historical disease reported. Clay-loam soil.",
};

export const exampleFarmerResponse: FarmerResponse = {
  id: "farmer-001",
  name: "John Mwangi",
  phone: "+254712345678",
  county: "Nyandarua",
  subCounty: "Ol Kalou",
  ward: "Kaimbaga",
  farmSize: 3.5,
  variety: "Shangi",
  plantingDate: "2026-05-12",
  latitude: "-0.2643",
  longitude: "36.3789",
  notes: "No historical disease reported. Clay-loam soil.",
  registeredAt: "2026-05-10T08:30:00Z",
};

// --------------- Field ---------------

export type FieldStatus = "Healthy" | "At Risk" | "Critical" | "Inactive";

export interface CreateFieldPayload {
  farmerId: string;
  name: string;
  county: string;
  subCounty: string;
  ward: string;
  variety: string;
  plantingDate: string;
  farmSize: number;
  latitude?: string;
  longitude?: string;
}

export interface FieldResponse {
  id: string;
  farmerId: string;
  name: string;
  county: string;
  subCounty: string;
  ward: string;
  variety: string;
  plantingDate: string;
  farmSize: number;
  status: FieldStatus;
  riskScore: number;
  confidence: number;
  rainfall: number;
  latitude: string | null;
  longitude: string | null;
  createdAt: string;
}

export const exampleCreateFieldPayload: CreateFieldPayload = {
  farmerId: "farmer-001",
  name: "Nyandarua Shangi Field",
  county: "Nyandarua",
  subCounty: "Ol Kalou",
  ward: "Kaimbaga",
  variety: "Shangi",
  plantingDate: "2026-05-12",
  farmSize: 3.5,
  latitude: "-0.2643",
  longitude: "36.3789",
};

export const exampleFieldResponse: FieldResponse = {
  id: "field-001",
  farmerId: "farmer-001",
  name: "Nyandarua Shangi Field",
  county: "Nyandarua",
  subCounty: "Ol Kalou",
  ward: "Kaimbaga",
  variety: "Shangi",
  plantingDate: "2026-05-12",
  farmSize: 3.5,
  status: "Healthy",
  riskScore: 24,
  confidence: 91,
  rainfall: 12,
  latitude: "-0.2643",
  longitude: "36.3789",
  createdAt: "2026-05-10T08:35:00Z",
};

// --------------- Satellite Observation ---------------

export type SpectralIndex =
  | "NDVI"
  | "NDMI"
  | "LAI"
  | "SAVI"
  | "EVI"
  | "NDWI";

export interface SatelliteObservationPayload {
  fieldId: string;
  timestamp: string;
  indices: { index: SpectralIndex; value: number }[];
  cloudCoverPercent: number;
}

export interface SatelliteObservationResponse {
  id: string;
  fieldId: string;
  timestamp: string;
  indices: { index: SpectralIndex; value: number; label: string; description: string }[];
  cloudCoverPercent: number;
  processedAt: string;
}

export const exampleSatelliteObservationPayload: SatelliteObservationPayload = {
  fieldId: "field-001",
  timestamp: "2026-06-25T06:00:00Z",
  indices: [
    { index: "NDVI", value: 0.72 },
    { index: "NDMI", value: 0.41 },
  ],
  cloudCoverPercent: 11,
};

export const exampleSatelliteObservationResponse: SatelliteObservationResponse = {
  id: "obs-20260625",
  fieldId: "field-001",
  timestamp: "2026-06-25T06:00:00Z",
  indices: [
    { index: "NDVI", value: 0.72, label: "NDVI", description: "Vegetation vigor is stable" },
    { index: "NDMI", value: 0.41, label: "NDMI", description: "Moisture is moderate" },
  ],
  cloudCoverPercent: 11,
  processedAt: "2026-06-25T06:15:00Z",
};

// --------------- Weather Observation ---------------

export interface WeatherObservationPayload {
  fieldId: string;
  timestamp: string;
  temperatureCelsius: number;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh?: number;
}

export interface WeatherObservationResponse {
  id: string;
  fieldId: string;
  timestamp: string;
  temperatureCelsius: number;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh: number | null;
  forecast: string;
}

export const exampleWeatherObservationPayload: WeatherObservationPayload = {
  fieldId: "field-001",
  timestamp: "2026-06-25T06:00:00Z",
  temperatureCelsius: 18,
  humidityPercent: 72,
  rainfallMm: 12,
  windSpeedKmh: 8,
};

export const exampleWeatherObservationResponse: WeatherObservationResponse = {
  id: "weather-20260625",
  fieldId: "field-001",
  timestamp: "2026-06-25T06:00:00Z",
  temperatureCelsius: 18,
  humidityPercent: 72,
  rainfallMm: 12,
  windSpeedKmh: 8,
  forecast: "Light rain expected tomorrow",
};

// --------------- Advisory ---------------

export type SeverityLevel = "Low" | "Medium" | "High";

export type AdvisoryStatus = "Sent" | "Published" | "Review" | "Delivered" | "Pending";

export interface AdvisoryResponse {
  id: string;
  fieldId: string;
  title: string;
  severity: SeverityLevel;
  confidence: number;
  recommendation: string;
  swahiliTranslation: string;
  smsStatus: AdvisoryStatus;
  triggeredBy: string;
  createdAt: string;
}

export const exampleAdvisoryResponse: AdvisoryResponse = {
  id: "adv-20260625-001",
  fieldId: "field-001",
  title: "Moisture Stress Watch",
  severity: "Medium",
  confidence: 91,
  recommendation:
    "Moisture levels are dropping slightly. Inspect soil moisture within 24 hours. If irrigation is available, water the affected section and monitor over the next three days.",
  swahiliTranslation: "Ushauri wa Kilimo cha Kidijitali",
  smsStatus: "Sent",
  triggeredBy: "NDMI drop below 0.45 threshold",
  createdAt: "2026-06-25T08:00:00Z",
};

// --------------- Advisory Log Entry (for history tables) ---------------

export interface AdvisoryLogEntry {
  id: string;
  fieldId: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  confidence: number;
  date: string;
  status: AdvisoryStatus;
}

export const exampleAdvisoryLogEntries: AdvisoryLogEntry[] = [
  {
    id: "adv-001",
    fieldId: "field-001",
    title: "Moisture Stress Watch",
    description: "Moisture levels are dropping slightly. Inspect soil hydration within 24 hours.",
    severity: "Medium",
    confidence: 91,
    date: "Jun 25, 2026",
    status: "Sent",
  },
  {
    id: "adv-002",
    fieldId: "field-001",
    title: "Healthy Vegetation Index",
    description: "NDVI density remains stable across monitored potato beds. No action needed.",
    severity: "Low",
    confidence: 94,
    date: "Jun 24, 2026",
    status: "Published",
  },
  {
    id: "adv-003",
    fieldId: "field-001",
    title: "Possible Disease Risk",
    description: "Relative humidity patterns suggest blight risk triggers. Review drainage.",
    severity: "High",
    confidence: 89,
    date: "Jun 22, 2026",
    status: "Review",
  },
];

// --------------- Historical Advisory Log (for advisories tab) ---------------

export interface HistoricalAdvisoryEntry {
  id: string;
  fieldId: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  confidence: number;
  status: AdvisoryStatus;
  date: string;
}

export const exampleHistoricalAdvisories: HistoricalAdvisoryEntry[] = [
  {
    id: "hist-001",
    fieldId: "field-001",
    title: "Soil Blight Pre-warning",
    description: "Favorable humidity detected. Inspect low spots for fungal spotting.",
    severity: "High",
    confidence: 89,
    status: "Delivered",
    date: "Jun 20, 2026",
  },
  {
    id: "hist-002",
    fieldId: "field-001",
    title: "Steady Transpiration Sweep",
    description: "Crop hydration meets baseline benchmarks across active zones.",
    severity: "Low",
    confidence: 92,
    status: "Delivered",
    date: "Jun 18, 2026",
  },
];

// --------------- Feedback ---------------

export type FeedbackRating = "yes" | "partially" | "no";

export interface FeedbackPayload {
  advisoryId: string;
  fieldId: string;
  farmerId: string;
  rating: FeedbackRating;
  notes: string;
  submittedAt: string;
}

export interface FeedbackResponse {
  id: string;
  advisoryId: string;
  fieldId: string;
  farmerId: string;
  rating: FeedbackRating;
  notes: string;
  submittedAt: string;
  acknowledged: boolean;
}

export const exampleFeedbackPayload: FeedbackPayload = {
  advisoryId: "adv-20260625-001",
  fieldId: "field-001",
  farmerId: "farmer-001",
  rating: "yes",
  notes: "Observed dry soil spots near the ridge. Irrigation was applied manually.",
  submittedAt: "2026-06-25T14:30:00Z",
};

export const exampleFeedbackResponse: FeedbackResponse = {
  id: "fb-20260625-001",
  advisoryId: "adv-20260625-001",
  fieldId: "field-001",
  farmerId: "farmer-001",
  rating: "yes",
  notes: "Observed dry soil spots near the ridge. Irrigation was applied manually.",
  submittedAt: "2026-06-25T14:30:00Z",
  acknowledged: true,
};

// --------------- Spectral Trend ---------------

export interface SpectralTrend {
  label: string;
  value: string;
  description: string;
}

export const exampleSpectralTrends: SpectralTrend[] = [
  { label: "NDVI", value: "0.72", description: "Vegetation vigor is stable" },
  { label: "NDMI", value: "0.41", description: "Moisture is moderate" },
  { label: "Rainfall", value: "12mm", description: "Light rainfall recorded" },
  { label: "Temperature", value: "18°C", description: "Cool growing conditions" },
];

// --------------- Advisory Chat ---------------

export interface ChatMessagePayload {
  message: string;
  language: "en" | "sw";
  fieldId: string;
  advisoryId: string;
}

export interface ChatMessageResponse {
  reply: string;
  sources: string[];
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: "farmer" | "fieldpulse";
  text: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
}

/*
  Future Endpoint:
  POST /advisories/{advisoryId}/chat

  Request:
  {
    "message": "What does moisture stress mean?",
    "language": "en",
    "fieldId": "field-001",
    "advisoryId": "adv-001"
  }

  Response:
  {
    "reply": "Moisture stress means your potato crop...",
    "sources": [
      "NDMI dropped below 0.45",
      "Rainfall 40% below average",
      "Crop stage: Vegetative"
    ],
    "confidence": 91
  }
*/
