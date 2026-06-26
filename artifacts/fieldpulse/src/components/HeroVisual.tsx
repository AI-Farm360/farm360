'use client';

import { motion } from 'motion/react';
import { MapPin, Sparkles, Satellite } from 'lucide-react';

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-4xl mx-auto mt-10 md:mt-14"
    >
      <div className="relative bg-brand-card border border-brand-border rounded-3xl p-5 md:p-6 shadow-[0_20px_60px_rgba(23,23,23,0.04)] overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(23,23,23,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {/* Map area - spans 3 cols */}
          <div className="md:col-span-3 rounded-2xl border border-brand-border overflow-hidden relative min-h-[280px]">
            {/* Farm field background using CSS gradient to simulate satellite imagery */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, #2d5a27 0%, #3a7a32 15%, #4a8a40 25%, #5a9a50 35%, #4a8540 45%, #3d7535 55%, #2d5a27 65%, #5a9a50 75%, #6aaa60 85%, #4a8540 100%)',
              backgroundSize: '200% 200%',
            }} />
            {/* Satellite scan line */}
            <motion.div
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-green/30 to-transparent"
              style={{ filter: 'blur(1px)' }}
            />
            {/* Field boundary polygon */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
              <motion.polygon
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                points="120,40 320,60 340,200 100,220"
                fill="rgba(34,163,79,0.08)"
                stroke="rgba(34,163,79,0.5)"
                strokeWidth="2"
                strokeDasharray="8,4"
              />
              {/* Crop health zones inside polygon */}
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                x="160" y="80" width="24" height="24" rx="3" fill="rgba(34,163,79,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                x="190" y="80" width="24" height="24" rx="3" fill="rgba(34,163,79,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                x="220" y="80" width="24" height="24" rx="3" fill="rgba(250,204,21,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                x="160" y="110" width="24" height="24" rx="3" fill="rgba(34,163,79,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                x="190" y="110" width="24" height="24" rx="3" fill="rgba(250,204,21,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.3 }}
                x="220" y="110" width="24" height="24" rx="3" fill="rgba(239,68,68,0.4)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.4 }}
                x="160" y="140" width="24" height="24" rx="3" fill="rgba(34,163,79,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.5 }}
                x="190" y="140" width="24" height="24" rx="3" fill="rgba(34,163,79,0.5)"
              />
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.6 }}
                x="220" y="140" width="24" height="24" rx="3" fill="rgba(239,68,68,0.5)"
              />
              {/* Marker */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1.0 }}
              >
                <circle cx="220" cy="130" r="4" fill="#22A34F" />
                <circle cx="220" cy="130" r="8" fill="rgba(34,163,79,0.2)" />
              </motion.g>
            </svg>
            {/* Bottom label */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-brand-border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-xs">
              <MapPin className="w-3 h-3 text-brand-green" />
              <span className="text-[10px] font-semibold text-brand-text">Nyandarua Field</span>
              <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse ml-1" />
              <span className="text-[8px] font-bold text-brand-green uppercase tracking-wider">Active</span>
            </div>
          </div>

          {/* Side panel - advisory card */}
          <div className="md:col-span-2 flex flex-col justify-center space-y-4">
            {/* Satellite orbit icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center mx-auto"
            >
              <Satellite className="w-4 h-4 text-brand-green" />
            </motion.div>

            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Live Advisory</span>
              </div>
              <p className="text-sm font-bold text-amber-900">Moisture Stress Watch</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Inspect soil moisture within 24 hours.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/50">Medium Risk</span>
                <span className="text-[10px] font-semibold text-amber-700 font-mono">91% confidence</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 text-[10px] text-brand-muted">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-brand-green/60" /> Healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-yellow-400/60" /> Monitor
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-400/60" /> Stress
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
