// ============================================================
// Farm360 / FieldPulse — Shared Frontend Types
// ============================================================

// --------------- Farmer ---------------

export interface Farmer {
  name: string;
  phone: string;
  county: string;
  subCounty: string;
  ward: string;
  village?: string;
  variety: string;
  plantingDate: string;
  farmSize: number;
  latitude?: string;
  longitude?: string;
  boundary?: [number, number][];
  notes?: string;
}

// --------------- Field ---------------

export interface Field {
  id: string;
  farmerId?: string;
  name: string;
  county: string;
  subCounty: string;
  ward: string;
  variety: string;
  plantingDate: string;
  farmSize: number;
  status: string;
  riskScore: number;
  confidence: number;
  rainfall: number;
  latitude?: string;
  longitude?: string;
}

// --------------- Satellite Observation ---------------

export interface SatelliteObservation {
  date: string;
  source: string;
  ndvi: number;
  ndmi: number;
  evi: number;
  cloud: string;
  quality: 'Good' | 'Fair' | 'Poor';
}

// --------------- Weather ---------------

export interface ForecastDay {
  day: string;
  temp: number;
  rain: number;
  icon: string;
  meaning: string;
}

// --------------- Advisory ---------------

export interface HistoricalAdvisory {
  id: string;
  fieldId: string;
  title: string;
  description: string;
  severity: string;
  confidence: number;
  date: string;
  status: string;
}

// --------------- Chat ---------------

export interface ChatMessage {
  id: string;
  role: 'farmer' | 'fieldpulse';
  text: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
}
