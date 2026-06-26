'use client';

import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

export default function MockMap() {
  return (
    <div className="bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(23,23,23,0.02)]">
      <div className="px-5 py-3 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-green" />
          <span className="text-xs font-bold text-brand-text">Nyandarua Field</span>
        </div>
        <span className="text-[9px] font-bold text-brand-green bg-brand-light-green/40 px-2 py-0.5 rounded-full border border-brand-green/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
          Monitoring Active
        </span>
      </div>

      {/* Styled mock map */}
      <div className="relative h-64 bg-[#F3F1EE] overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(34,163,79,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,163,79,0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Topographic-style contour lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
          <motion.path
            d="M50,125 Q125,80 200,120 T350,110 T450,130"
            fill="none"
            stroke="rgba(34,163,79,0.08)"
            strokeWidth="1.5"
          />
          <motion.path
            d="M30,150 Q100,110 180,145 T320,135 T470,155"
            fill="none"
            stroke="rgba(34,163,79,0.06)"
            strokeWidth="1.5"
          />
          {/* Field boundary */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            points="180,60 340,80 360,190 150,210"
            fill="rgba(34,163,79,0.06)"
            stroke="rgba(34,163,79,0.4)"
            strokeWidth="2"
            strokeDasharray="8,4"
          />
          {/* Grid cells inside boundary */}
          <rect x="210" y="100" width="20" height="20" rx="2" fill="rgba(34,163,79,0.4)" />
          <rect x="240" y="100" width="20" height="20" rx="2" fill="rgba(34,163,79,0.4)" />
          <rect x="270" y="100" width="20" height="20" rx="2" fill="rgba(34,163,79,0.4)" />
          <rect x="210" y="130" width="20" height="20" rx="2" fill="rgba(250,204,21,0.3)" />
          <rect x="240" y="130" width="20" height="20" rx="2" fill="rgba(34,163,79,0.4)" />
          <rect x="270" y="130" width="20" height="20" rx="2" fill="rgba(239,68,68,0.25)" />
          <rect x="210" y="160" width="20" height="20" rx="2" fill="rgba(34,163,79,0.4)" />
          <rect x="240" y="160" width="20" height="20" rx="2" fill="rgba(250,204,21,0.3)" />
          <rect x="270" y="160" width="20" height="20" rx="2" fill="rgba(239,68,68,0.35)" />
          {/* Marker */}
          <motion.circle
            cx="250" cy="140" r="5" fill="#22A34F"
            animate={{ r: [5, 7, 5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-brand-border px-4 py-2 flex items-center justify-between text-[10px]">
          <span className="text-brand-muted font-medium">Lat -0.2643, Lon 36.3789</span>
          <span className="text-brand-green font-semibold">Zoom 16</span>
        </div>
      </div>
    </div>
  );
}
