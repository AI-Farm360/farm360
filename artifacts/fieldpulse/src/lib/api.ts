// ============================================================
// FieldPulse API Client — maps to Python FastAPI backend
// Requests go through Vite proxy: /api/* → localhost:8000
// ============================================================

// ---------- Backend types (snake_case as returned by Python) ----------

export interface BackendField {
  id: string;
  farmer_name: string;
  farmer_phone: string;
  boundary: unknown;
  planting_date: string;
  potato_variety: string;
  location: { lat: number; lng: number; region?: string | null; county?: string | null };
  growth_stage: 'Emergence' | 'Vegetative' | 'Tuber Initiation' | 'Bulking' | 'Maturation' | 'Harvest Ready';
  days_since_planting: number;
  created_at: string;
}

export interface BackendSatellite {
  ndvi: number;
  ndmi: number;
  evi: number;
}

export interface BackendWeather {
  rainfall_mm: number;
  rainfall_anomaly_pct: number;
  temperature_c: number;
  humidity_pct: number;
}

export interface BackendMonitoring {
  field_id: string;
  timestamp: string;
  satellite: BackendSatellite;
  weather: BackendWeather;
  source: string;
}

export type BackendRiskType =
  | 'healthy'
  | 'water_stress'
  | 'nutrient_deficiency'
  | 'pest_disease_pressure';

export interface BackendAdvisory {
  id: string;
  field_id: string;
  timestamp: string;
  growth_stage: string;
  risk_type: BackendRiskType;
  risk_score: number;       // 0–100
  confidence: number;       // 0–1
  recommended_action: string;
  message: string;
  language: 'en' | 'sw';
  inputs: BackendMonitoring;
}

export interface BackendAlert {
  id: string;
  field_id: string;
  farmer_name: string;
  farmer_phone: string;
  risk_type: BackendRiskType;
  risk_score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

export interface BackendFeedback {
  id: string;
  field_id: string;
  advisory_id: string | null;
  detected_condition: BackendRiskType;
  farmer_confirms: boolean;
  notes: string | null;
  created_at: string;
}

// ---------- UI helper mappings ----------

export function riskTypeToTitle(r: BackendRiskType): string {
  return {
    healthy: 'Field Is Healthy',
    water_stress: 'Moisture Stress Watch',
    nutrient_deficiency: 'Nutrient Deficiency Alert',
    pest_disease_pressure: 'Disease Pressure Warning',
  }[r];
}

export function riskTypeToTriggeredBy(r: BackendRiskType, sat: BackendSatellite, score: number): string {
  return {
    healthy: `Risk score ${score} — all indices within normal range`,
    water_stress: `NDMI drop below 0.45 threshold (current: ${sat.ndmi.toFixed(2)})`,
    nutrient_deficiency: `NDVI decline detected (current: ${sat.ndvi.toFixed(2)})`,
    pest_disease_pressure: `EVI anomaly detected (current: ${sat.evi.toFixed(2)})`,
  }[r];
}

export function scoreToSeverity(score: number): 'Low' | 'Medium' | 'High' {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

// ---------- HTTP helper ----------

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ---------- Health ----------

export async function getHealth() {
  return req<{ status: string; service: string; time: string }>('GET', '/health');
}

// ---------- Fields ----------

export async function listFields() {
  return req<BackendField[]>('GET', '/api/fields');
}

export async function getField(fieldId: string) {
  return req<BackendField>('GET', `/api/fields/${fieldId}`);
}

export async function createField(payload: {
  farmer_name: string;
  farmer_phone: string;
  boundary: [number, number][];
  planting_date: string;
  potato_variety: string;
  location: { lat: number; lng: number; county?: string; region?: string };
}) {
  return req<BackendField>('POST', '/api/fields', payload);
}

// ---------- Monitoring ----------

export async function getMonitoring(fieldId: string) {
  return req<BackendMonitoring>('GET', `/api/monitoring/${fieldId}`);
}

export async function getMonitoringHistory(fieldId: string, count = 10) {
  return req<{ field_id: string; readings: BackendMonitoring[] }>(
    'GET', `/api/monitoring/${fieldId}/history?count=${count}`
  );
}

// ---------- Advisory ----------

export async function analyzeField(fieldId: string, language: 'en' | 'sw' = 'en') {
  return req<BackendAdvisory>('POST', `/api/advisory/${fieldId}/analyze`, { language });
}

export async function getLatestAdvisory(fieldId: string) {
  return req<BackendAdvisory>('GET', `/api/advisory/${fieldId}`);
}

export async function getAdvisoryHistory(fieldId: string) {
  return req<BackendAdvisory[]>('GET', `/api/advisory/${fieldId}/history`);
}

// ---------- Alerts ----------

export async function listAlerts() {
  return req<BackendAlert[]>('GET', '/api/alerts');
}

export async function getFieldAlerts(fieldId: string) {
  return req<BackendAlert[]>('GET', `/api/alerts/${fieldId}`);
}

// ---------- Feedback ----------

export async function submitFeedback(
  fieldId: string,
  payload: {
    advisory_id?: string;
    detected_condition: BackendRiskType;
    farmer_confirms: boolean;
    notes?: string;
  }
) {
  return req<BackendFeedback>('POST', `/api/feedback/${fieldId}`, payload);
}
