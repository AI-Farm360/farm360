'use client';

import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { Compass, Eye, Droplets, Activity, CloudRain, LineChart } from 'lucide-react';
import { useDashboard } from '@/src/contexts/DashboardContext';
import * as mock from '@/src/data/mockData';
import SatelliteHealthVisual from '@/src/components/SatelliteHealthVisual';
import DataReliabilityVisual from '@/src/components/DataReliabilityVisual';

const FieldMapVisual = dynamic(() => import('@/src/components/FieldMapVisual'), { ssr: false });

export default function SatelliteDataPage() {
  const { activeField, farmerProfile } = useDashboard();
  const lat = parseFloat(farmerProfile.latitude || '-0.2643');
  const lng = parseFloat(farmerProfile.longitude || '36.3789');

  const observations = mock.observationHistory;
  const qualityColors = { Good: 'bg-emerald-50 text-emerald-700', Fair: 'bg-amber-50 text-amber-700', Poor: 'bg-rose-50 text-rose-700' };

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
        </div>
        <FieldMapVisual latitude={lat} longitude={lng} fieldName={activeField.name} readOnly />
      </div>

      <SatelliteHealthVisual />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg"><Eye className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">NDVI</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-mono text-2xl font-bold text-[#171717]">0.72</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2 bg-emerald-500 rounded-full w-[72%] max-w-[72%]"
            />
          </div>
          <p className="text-[11px] text-brand-green font-semibold mt-1">Vegetation is healthy</p>
        </div>
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg"><Droplets className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">NDMI</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-mono text-2xl font-bold text-[#171717]">0.41</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '41%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2 bg-amber-500 rounded-full w-[41%] max-w-[72%]"
            />
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Moisture is moderate but declining</p>
        </div>
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg"><Activity className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">EVI</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="font-mono text-2xl font-bold text-[#171717]">0.58</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '58%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2 bg-indigo-500 rounded-full w-[58%] max-w-[72%]"
            />
          </div>
          <p className="text-[11px] text-brand-green font-semibold mt-1">Crop canopy is developing well</p>
        </div>
        <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg"><CloudRain className="w-4 h-4" /></div>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Cloud Cover</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#171717] mt-2">11%</p>
          <p className="text-[11px] text-brand-green font-semibold mt-1">Image quality is good</p>
        </div>
      </div>

      <DataReliabilityVisual />

      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider pb-3 border-b border-[#ECE8E1]">Observation Metadata</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#6B6B6B] tracking-wider">Satellite</span>
            <p className="text-sm font-bold text-[#171717]">Sentinel-2</p>
            <p className="text-[10px] text-[#6B6B6B]">MSI Sensor</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#6B6B6B] tracking-wider">Last Pass</span>
            <p className="text-sm font-bold text-[#171717]">Jun 25, 2026</p>
            <p className="text-[10px] text-[#6B6B6B]">06:00 UTC</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#6B6B6B] tracking-wider">Processing</span>
            <p className="text-sm font-bold text-[#171717]">Level-2A</p>
            <p className="text-[10px] text-[#6B6B6B]">Atmospherically corrected</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#6B6B6B] tracking-wider">Next Pass</span>
            <p className="text-sm font-bold text-[#171717]">Jun 28, 2026</p>
            <p className="text-[10px] text-[#6B6B6B]">~09:45 UTC</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider pb-3 border-b border-[#ECE8E1]">Vegetation &amp; Moisture Interpretation</h3>
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0"><Eye className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-[#171717]">NDVI &mdash; Vegetation Vigor</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">NDVI value of 0.72 indicates dense, healthy potato canopy. The field&apos;s south-east section shows slightly lower values (0.58), suggesting slightly thinner canopy in that zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg shrink-0"><Droplets className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-[#171717]">NDMI &mdash; Moisture Content</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">NDMI at 0.41 suggests moderate canopy moisture. This represents a 9% decline from the previous observation. The declining trend indicates the crop may begin experiencing mild moisture stress within 5-7 days.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0"><Activity className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-[#171717]">EVI &mdash; Canopy Structure</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">EVI of 0.58 confirms the crop canopy is structurally sound. EVI is less sensitive to atmospheric interference than NDVI, providing additional confidence in the overall vegetation assessment.</p>
            </div>
          </div>
        </div>
      </div>

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
