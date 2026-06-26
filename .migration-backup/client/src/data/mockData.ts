import {
  exampleFarmerResponse,
  exampleFieldResponse,
  exampleWeatherObservationResponse,
  exampleAdvisoryResponse,
  exampleAdvisoryLogEntries,
  exampleHistoricalAdvisories,
  exampleSpectralTrends,
  exampleNotifications,
  type FarmerResponse,
  type FieldResponse,
  type AdvisoryLogEntry,
  type HistoricalAdvisoryEntry,
  type SpectralTrend,
  type NotificationResponse,
} from './apiContract';

export const farmer: FarmerResponse = exampleFarmerResponse;
export const field: FieldResponse = exampleFieldResponse;
export const weather = exampleWeatherObservationResponse;
export const advisory = exampleAdvisoryResponse;
export const advisoryEntries: AdvisoryLogEntry[] = exampleAdvisoryLogEntries;
export const historicalAdvisories: HistoricalAdvisoryEntry[] = exampleHistoricalAdvisories;
export const trends: SpectralTrend[] = exampleSpectralTrends;
export const notifications: NotificationResponse[] = exampleNotifications;

// --------------- Satellite observation history ---------------

export interface ObservationRow {
  date: string;
  source: string;
  ndvi: number;
  ndmi: number;
  evi: number;
  cloud: string;
  quality: 'Good' | 'Fair' | 'Poor';
}

export const observationHistory: ObservationRow[] = [
  { date: 'Jun 25, 2026', source: 'Sentinel-2', ndvi: 0.72, ndmi: 0.41, evi: 0.58, cloud: '11%', quality: 'Good' },
  { date: 'Jun 22, 2026', source: 'Landsat 9', ndvi: 0.7, ndmi: 0.43, evi: 0.56, cloud: '8%', quality: 'Good' },
  { date: 'Jun 18, 2026', source: 'Sentinel-2', ndvi: 0.74, ndmi: 0.45, evi: 0.6, cloud: '15%', quality: 'Fair' },
  { date: 'Jun 14, 2026', source: 'Sentinel-2', ndvi: 0.71, ndmi: 0.44, evi: 0.57, cloud: '22%', quality: 'Fair' },
  { date: 'Jun 10, 2026', source: 'Landsat 9', ndvi: 0.68, ndmi: 0.42, evi: 0.54, cloud: '6%', quality: 'Good' },
  { date: 'Jun 06, 2026', source: 'Sentinel-2', ndvi: 0.65, ndmi: 0.46, evi: 0.52, cloud: '35%', quality: 'Poor' },
  { date: 'Jun 02, 2026', source: 'Sentinel-2', ndvi: 0.62, ndmi: 0.48, evi: 0.5, cloud: '4%', quality: 'Good' },
  { date: 'May 29, 2026', source: 'Landsat 9', ndvi: 0.59, ndmi: 0.47, evi: 0.48, cloud: '10%', quality: 'Good' },
];

// --------------- Weather forecast ---------------

export interface ForecastDay {
  day: string;
  temp: number;
  rain: number;
  icon: string;
  meaning: string;
}

export const forecastDays: ForecastDay[] = [
  { day: 'Mon', temp: 16, rain: 2, icon: 'Cloud', meaning: 'Low rainfall, monitor moisture.' },
  { day: 'Tue', temp: 18, rain: 4, icon: 'CloudSun', meaning: 'Light showers expected.' },
  { day: 'Wed', temp: 17, rain: 8, icon: 'CloudRain', meaning: 'Moderate rain, check runoff.' },
  { day: 'Thu', temp: 19, rain: 6, icon: 'CloudRain', meaning: 'Rain easing, good for field work.' },
  { day: 'Fri', temp: 18, rain: 3, icon: 'CloudSun', meaning: 'Drying trend begins.' },
  { day: 'Sat', temp: 16, rain: 10, icon: 'CloudRain', meaning: 'Heavier rain, watch for pooling.' },
  { day: 'Sun', temp: 17, rain: 5, icon: 'Cloud', meaning: 'Scattered rain, light irrigation day.' },
];

// --------------- Rainfall history ---------------

export interface RainfallWeek {
  week: string;
  rain: number;
  label: string;
  short: string;
}

export const rainfallData: RainfallWeek[] = [
  { week: 'May 29\n– Jun 4', rain: 8, label: 'May 29–Jun 4', short: '8mm' },
  { week: 'Jun 5\n– 11', rain: 15, label: 'Jun 5–11', short: '15mm' },
  { week: 'Jun 12\n– 18', rain: 20, label: 'Jun 12–18', short: '20mm' },
  { week: 'Jun 19\n– 25', rain: 12, label: 'Jun 19–25', short: '12mm' },
];
