'use client';

import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

const rows = 5;
const cols = 8;

// Pattern: green=healthy, yellow=monitor, red=stress
const pattern: string[] = [
  'g','g','g','g','g','y','g','g',
  'g','g','y','g','g','g','r','y',
  'g','g','g','r','y','g','g','g',
  'y','g','g','g','g','r','y','g',
  'g','r','y','g','g','g','g','y',
];

const colorMap: Record<string, string> = {
  g: 'bg-emerald-400/70',
  y: 'bg-amber-400/60',
  r: 'bg-rose-400/60',
};

export default function FieldHealthMap() {
  return (
    <div className="h-full bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(23,23,23,0.02)]">
      <div className="flex items-center gap-2 pb-4 border-b border-brand-border mb-5">
        <Leaf className="w-4 h-4 text-brand-green" />
        <div>
          <h3 className="text-sm font-bold text-brand-text">Vegetation Health Map</h3>
          <p className="text-[10px] text-brand-muted">FieldPulse NDVI crop vitality overlay</p>
        </div>
      </div>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {pattern.map((cell, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.15, delay: i * 0.012 }}
            className={`aspect-square rounded-md ${colorMap[cell] || 'bg-emerald-200/30'} border border-white/30`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-brand-border">
        <span className="flex items-center gap-1.5 text-[10px] text-brand-muted font-medium">
          <span className="w-2.5 h-2.5 rounded bg-emerald-400/70" /> Healthy
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-brand-muted font-medium">
          <span className="w-2.5 h-2.5 rounded bg-amber-400/60" /> Monitor
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-brand-muted font-medium">
          <span className="w-2.5 h-2.5 rounded bg-rose-400/60" /> Stress
        </span>
      </div>
    </div>
  );
}
