'use client';

import { motion } from 'motion/react';
import { Bell, Signal, Wifi, Battery } from 'lucide-react';

export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto w-[260px]"
    >
      {/* Phone frame */}
      <div className="bg-[#171717] rounded-[2rem] p-3 shadow-2xl border border-white/10">
        {/* Status bar */}
        <div className="flex items-center justify-between px-2 pb-3 text-white/70">
          <span className="text-[9px] font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Notch */}
        <div className="w-20 h-5 bg-[#171717] rounded-full mx-auto -mt-1 mb-3 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Screen content */}
        <div className="bg-white rounded-2xl p-4 space-y-3 min-h-[320px]">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center">
              <span className="text-[6px] font-bold text-brand-green">FP</span>
            </div>
            <span className="text-[10px] font-bold text-brand-text">FieldPulse Advisory</span>
            <span className="ml-auto text-[8px] text-brand-muted">Now</span>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <div className="bg-[#F3F1EE] rounded-2xl rounded-tl-sm p-3">
              <p className="text-[11px] text-brand-text leading-relaxed">
                <span className="font-bold">Moisture Stress Watch</span>
              </p>
              <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                Moisture levels are dropping in your Nyandarua field.
              </p>
            </div>
            <div className="bg-[#F3F1EE] rounded-2xl rounded-tl-sm p-3">
              <p className="text-[10px] text-brand-muted leading-relaxed">
                Check soil moisture today. If the top 5&ndash;10cm is dry, irrigate if possible.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-2.5 text-center">
            <p className="text-[9px] font-bold text-brand-green uppercase tracking-wider">View in Dashboard</p>
          </div>

          {/* Timestamp */}
          <p className="text-[8px] text-brand-muted text-center pt-1">FieldPulse &middot; AI-Generated Advisory</p>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-28 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
