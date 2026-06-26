'use client';

import { motion } from 'motion/react';
import { Eye, Droplets, CloudRain, Thermometer } from 'lucide-react';

interface Indicator {
  label: string;
  value: string;
  status: string;
  fillPercent: number;
  color: string;
  icon: typeof Eye;
}

const indicators: Indicator[] = [
  { label: 'Vegetation', value: 'NDVI 0.72', status: 'Healthy', fillPercent: 72, color: 'bg-emerald-500', icon: Eye },
  { label: 'Moisture', value: 'NDMI 0.41', status: 'Moderate', fillPercent: 55, color: 'bg-sky-500', icon: Droplets },
  { label: 'Rainfall', value: '12mm', status: 'Recent', fillPercent: 68, color: 'bg-blue-500', icon: CloudRain },
  { label: 'Temperature', value: '18°C', status: 'Ideal', fillPercent: 65, color: 'bg-amber-500', icon: Thermometer },
];

export default function MonitorIndicators() {
  return (
    <div className="bg-[#FAF9F6] border border-[#ECE8E1] rounded-2xl p-5 space-y-4 shadow-xs">
      <h3 className="text-xs font-bold text-[#171717]">What FieldPulse will monitor</h3>

      <div className="space-y-3">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          return (
            <div key={ind.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  <span className="text-[11px] font-semibold text-[#171717]">{ind.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6B6B6B] font-mono">{ind.value}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    ind.status === 'Healthy' || ind.status === 'Ideal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    ind.status === 'Moderate' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>{ind.status}</span>
                </div>
              </div>
              <div className="w-full bg-[#E8E4DE] rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ind.fillPercent}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                  className={`h-full rounded-full ${ind.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
