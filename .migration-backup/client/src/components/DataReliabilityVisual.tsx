'use client';

import { motion } from 'motion/react';
import { Satellite, CloudRain, RefreshCw, Brain } from 'lucide-react';

interface ReliabilityMetric {
  label: string;
  value: number;
  icon: typeof Satellite;
  detail: string;
}

interface DataReliabilityVisualProps {
  metrics?: ReliabilityMetric[];
}

const defaultMetrics: ReliabilityMetric[] = [
  { label: 'Satellite Coverage', value: 94, icon: Satellite, detail: 'Sentinel-2 & Landsat 9' },
  { label: 'Cloud Cover', value: 89, icon: CloudRain, detail: '11% cloud — clear pass' },
  { label: 'Data Freshness', value: 100, icon: RefreshCw, detail: 'Updated today' },
  { label: 'AI Confidence', value: 91, icon: Brain, detail: 'High reliability' },
];

function ringColor(value: number): string {
  if (value >= 85) return 'stroke-emerald-500';
  if (value >= 65) return 'stroke-amber-500';
  return 'stroke-rose-500';
}

function ringBg(value: number): string {
  if (value >= 85) return 'text-emerald-100';
  if (value >= 65) return 'text-amber-100';
  return 'text-rose-100';
}

function ringText(value: number): string {
  if (value >= 85) return 'text-emerald-600';
  if (value >= 65) return 'text-amber-600';
  return 'text-rose-600';
}

function CircularMetric({ label, value, icon: Icon, detail }: ReliabilityMetric) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="5" className={ringBg(value)} />
          <motion.circle
            cx="32" cy="32" r="28" fill="none" strokeWidth="5" strokeLinecap="round"
            className={ringColor(value)}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${ringText(value)}`} />
        </div>
      </div>
      <span className="text-[10px] font-bold text-[#171717] text-center leading-tight">{label}</span>
      <span className={`text-lg font-bold font-mono ${ringText(value)}`}>{value}%</span>
      <span className="text-[9px] text-[#6B6B6B] text-center">{detail}</span>
    </div>
  );
}

export default function DataReliabilityVisual({ metrics = defaultMetrics }: DataReliabilityVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-3"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <RefreshCw className="w-4 h-4 text-brand-green" />
        <div>
          <h3 className="text-xs font-bold text-[#171717]">Data Reliability</h3>
          <p className="text-[10px] text-[#6B6B6B]">Signal &amp; analysis quality</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {metrics.map((metric) => (
          <CircularMetric key={metric.label} {...metric} />
        ))}
      </div>
    </motion.div>
  );
}
