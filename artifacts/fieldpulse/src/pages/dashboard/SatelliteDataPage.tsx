import { motion } from 'motion/react';
import { Compass, Eye, Droplets, Activity, CloudRain, LineChart } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import * as mock from '@/data/mockData';
import SatelliteHealthVisual from '@/components/SatelliteHealthVisual';
import DataReliabilityVisual from '@/components/DataReliabilityVisual';
import FieldMapVisual from '@/components/FieldMapVisual';

export default function SatelliteDataPage() {
  const { activeField, farmerProfile, monitoring } = useDashboard();
  const lat = parseFloat(farmerProfile.latitude || '-0.2643');
  const lng = parseFloat(farmerProfile.longitude || '36.3789');

  // Use live satellite data when available, fall back to mock
  const ndvi = monitoring?.satellite.ndvi ?? 0.72;
  const ndmi = monitoring?.satellite.ndmi ?? 0.41;
  const evi = monitoring?.satellite.evi ?? 0.58;
  const rainfall = monitoring?.weather.rainfall_mm ?? 12;
  const temperature = monitoring?.weather.temperature_c ?? 18;
  const humidity = monitoring?.weather.humidity_pct ?? 72;

  const ndviPct = Math.round(Math.max(0, Math.min(1, (ndvi + 1) / 2)) * 100);
  const ndmiPct = Math.round(Math.max(0, Math.min(1, (ndmi + 1) / 2)) * 100);
  const eviPct = Math.round(Math.max(0, Math.min(1, (evi + 1) / 2)) * 100);

  const ndviLabel = ndvi > 0.65 ? 'Vegetation is healthy' : ndvi > 0.4 ? 'Vegetation is moderate' : 'Vegetation stress detected';
  const ndmiLabel = ndmi > 0.5 ? 'Moisture levels are good' : ndmi > 0.3 ? 'Moisture is moderate but declining' : 'Low moisture — check irrigation';
  const eviLabel = evi > 0.55 ? 'Crop canopy is developing well' : evi > 0.35 ? 'Canopy growth is moderate' : 'Canopy development is slow';

  const observations = mock.observationHistory;
  const qualityColors: Record<string, string> = { Good: 'bg-emerald-50 text-emerald-700', Fair: 'bg-amber-50 text-amber-700', Poor: 'bg-rose-50 text-rose-700' };

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-[#ECE8E1]">
          <div className="p-1.5 bg-[#E8F5E9] text-brand-green rounded-lg">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Satellite Data</h2>
            <p className="text-[10px] text-[#6B6B6B]">Latest Sentinel-2 observation for {activeField.name}.</p>
          </div>
          {monitoring && (
            <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live · {new Date(monitoring.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <FieldMapVisual latitude={lat} longitude={lng} fieldName={activeField.name} readOnly />
      </div>

      <SatelliteHealthVisual />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NDVI */}
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg"><Eye className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">NDVI</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-mono text-2xl font-bold text-[#171717]">{ndvi.toFixed(2)}</p>
            <motion.div
              key={ndvi}
              initial={{ width: 0 }}
              animate={{ width: `${ndviPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2 bg-emerald-500 rounded-full"
              style={{ maxWidth: '72%' }}
            />
          </div>
          <p className="text-[11px] text-brand-green font-semibold mt-1">{ndviLabel}</p>
        </div>

        {/* NDMI */}
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg"><Droplets className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">NDMI</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-mono text-2xl font-bold text-[#171717]">{ndmi.toFixed(2)}</p>
            <motion.div
              key={ndmi}
              initial={{ width: 0 }}
              animate={{ width: `${ndmiPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2 bg-amber-500 rounded-full"
              style={{ maxWidth: '72%' }}
            />
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">{ndmiLabel}</p>
        </div>

        {/* EVI */}
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg"><Activity className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">EVI</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-mono text-2xl font-bold text-[#171717]">{evi.toFixed(2)}</p>
            <motion.div
              key={evi}
              initial={{ width: 0 }}
              animate={{ width: `${eviPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2 bg-indigo-500 rounded-full"
              style={{ maxWidth: '72%' }}
            />
          </div>
          <p className="text-[11px] text-brand-green font-semibold mt-1">{eviLabel}</p>
        </div>

        {/* Weather summary */}
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg"><CloudRain className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Weather</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#171717] mt-2">{rainfall.toFixed(0)}mm</p>
          <p className="text-[11px] text-brand-green font-semibold mt-1">{temperature}°C · {humidity}% RH</p>
        </div>
      </div>

      <DataReliabilityVisual />

      <div className="bg-white border border-[#ECE8E1] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#ECE8E1]">
          <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">30-Day Satellite Observation History</h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">Raw spectral indices from Sentinel-2 and Landsat passes.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#ECE8E1] text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Source</th>
                <th className="py-3 px-5">NDVI</th>
                <th className="py-3 px-5">NDMI</th>
                <th className="py-3 px-5">EVI</th>
                <th className="py-3 px-5">Cloud Cover</th>
                <th className="py-3 px-5">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1]">
              {/* Inject live reading as most recent row if available */}
              {monitoring && (
                <tr className="bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors">
                  <td className="py-3 px-5 text-[#171717] font-semibold">
                    {new Date(monitoring.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className="ml-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">LIVE</span>
                  </td>
                  <td className="py-3 px-5 text-[#6B6B6B] capitalize">{monitoring.source}</td>
                  <td className="py-3 px-5 font-mono text-[#171717]">{monitoring.satellite.ndvi.toFixed(2)}</td>
                  <td className="py-3 px-5 font-mono text-[#171717]">{monitoring.satellite.ndmi.toFixed(2)}</td>
                  <td className="py-3 px-5 font-mono text-[#171717]">{monitoring.satellite.evi.toFixed(2)}</td>
                  <td className="py-3 px-5 text-[#6B6B6B]">—</td>
                  <td className="py-3 px-5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Good</span>
                  </td>
                </tr>
              )}
              {observations.map((obs) => (
                <tr key={obs.date} className="hover:bg-[#FAF9F6]/40 transition-colors">
                  <td className="py-3 px-5 text-[#171717] font-semibold">{obs.date}</td>
                  <td className="py-3 px-5 text-[#6B6B6B]">{obs.source}</td>
                  <td className="py-3 px-5 font-mono text-[#171717]">{obs.ndvi}</td>
                  <td className="py-3 px-5 font-mono text-[#171717]">{obs.ndmi}</td>
                  <td className="py-3 px-5 font-mono text-[#171717]">{obs.evi}</td>
                  <td className="py-3 px-5 text-[#6B6B6B]">{obs.cloud}</td>
                  <td className="py-3 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${qualityColors[obs.quality]}`}>{obs.quality}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#FAF9F6] border border-[#ECE8E1] rounded-xl px-5 py-3 flex items-center gap-2.5 text-xs text-[#6B6B6B]">
        <LineChart className="w-3.5 h-3.5 text-brand-green shrink-0" />
        <span className="italic">Data sourced from Sentinel-2 MSI and Landsat 9 OLI-2. All indices are atmospherically corrected.</span>
      </div>
    </motion.div>
  );
}
