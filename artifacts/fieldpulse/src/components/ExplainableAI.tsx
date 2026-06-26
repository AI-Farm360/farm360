'use client';

import { motion } from 'motion/react';
import { Eye, Droplets, Thermometer, CloudRain, ArrowDown, Brain, Sparkles } from 'lucide-react';

interface Factor {
  label: string;
  status: 'good' | 'warning' | 'normal';
  value: string;
  icon: typeof Eye;
}

const factors: Factor[] = [
  { label: 'Vegetation', status: 'good', value: 'NDVI 0.72 — Healthy', icon: Eye },
  { label: 'Moisture', status: 'warning', value: 'NDMI 0.41 — Dropping', icon: Droplets },
  { label: 'Temperature', status: 'good', value: '18°C — Good', icon: Thermometer },
  { label: 'Rainfall', status: 'warning', value: '12mm — Below normal', icon: CloudRain },
];

const statusColors = {
  good: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  warning: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  normal: { dot: 'bg-sky-500', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

export default function ExplainableAI() {
  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <Brain className="w-4 h-4 text-brand-green" />
        <h3 className="text-xs font-bold text-[#171717]">Why did we generate this advisory?</h3>
      </div>

      <div className="space-y-2">
        {factors.map((f, i) => {
          const Icon = f.icon;
          const colors = statusColors[f.status];
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                <span className="text-xs font-semibold text-[#171717]">{f.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                <span className={`text-[10px] font-semibold ${colors.text}`}>{f.value}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex items-center justify-center gap-2 py-1"
      >
        <ArrowDown className="w-4 h-4 text-brand-green" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-[#171717] text-white rounded-2xl p-4 space-y-2"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-green" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">AI Conclusion</span>
        </div>
        <p className="text-sm font-semibold leading-snug">Possible moisture stress detected</p>
        <div className="pt-2 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Recommended Action</span>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            Inspect soil moisture within 24 hours. If irrigation is available, water the affected section and monitor over the next three days.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
