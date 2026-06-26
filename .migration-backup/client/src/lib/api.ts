// ============================================================
// Farm360 API Layer — Placeholder functions
// Switch NEXT_PUBLIC_API_URL to the real backend when ready.
// ============================================================

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${BASE}${path}`;
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// --------------- Farmer ---------------

export async function createFarmer(payload: {
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
}) {
  // POST /farmers
  return request<{ id: string }>('POST', '/farmers', payload);
}

// --------------- Fields ---------------

export async function createField(payload: {
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
}) {
  // POST /fields
  return request<{ id: string }>('POST', '/fields', payload);
}

export async function getField(fieldId: string) {
  // GET /fields/{fieldId}
  // Returns FieldResponse from apiContract
  return request<Record<string, unknown>>('GET', `/fields/${fieldId}`);
}

export async function getFieldAnalysis(fieldId: string) {
  // GET /fields/{fieldId}/analysis
  // Returns spectral indices, weather summary, risk score
  return request<Record<string, unknown>>(
    'GET',
    `/fields/${fieldId}/analysis`
  );
}

// --------------- Advisories ---------------

export async function getAdvisories(fieldId: string) {
  // GET /fields/{fieldId}/advisories
  return request<Record<string, unknown>[]>('GET', `/fields/${fieldId}/advisories`);
}

export async function askAdvisoryChat(
  advisoryId: string,
  payload: { message: string; language: 'en' | 'sw'; fieldId: string }
) {
  // POST /advisories/{advisoryId}/chat
  return request<{ reply: string; sources: string[]; confidence: number }>(
    'POST',
    `/advisories/${advisoryId}/chat`,
    payload
  );
}

// --------------- Notifications ---------------

export async function getNotifications() {
  // GET /notifications
  return request<Record<string, unknown>[]>('GET', '/notifications');
}

export async function markNotificationRead(notificationId: string) {
  // PATCH /notifications/{notificationId}/read
  return request<{ success: boolean }>(
    'PATCH',
    `/notifications/${notificationId}/read`
  );
}

export async function markAllNotificationsRead() {
  // PATCH /notifications/read-all
  return request<{ success: boolean }>('PATCH', '/notifications/read-all');
}

// --------------- Feedback ---------------

export async function submitFeedback(payload: {
  advisoryId: string;
  fieldId: string;
  farmerId: string;
  rating: 'yes' | 'partially' | 'no';
  notes: string;
}) {
  // POST /feedback
  return request<{ id: string }>('POST', '/feedback', payload);
}
