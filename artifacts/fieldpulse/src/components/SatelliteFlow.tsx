'use client';

import { motion } from 'motion/react';
import {
  Satellite, CloudSun, Sprout, Brain, MessageSquareText,
  Thermometer, Droplets,
} from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';

const steps = [
  {
    icon: Satellite,
    title: 'Satellite Image',
    description: 'Vegetation and moisture signals are extracted from the field.',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="grid grid-cols-5 gap-[3px] w-fit">
          {['g','g','g','y','g','g','y','g','r','g','y','g','g','g','y','g','g','r','g','g','g','y','g','g','g'].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded-[3px] border border-white/50" style={{
              backgroundColor: c === 'g' ? 'rgba(52,211,153,0.45)' : c === 'y' ? 'rgba(251,191,36,0.4)' : 'rgba(251,113,133,0.35)',
            }} />
          ))}
        </div>
      </div>
    ),
    meta: 'NDVI: 0.72',
  },
  {
    icon: CloudSun,
    title: 'Weather Data',
    description: 'Rainfall, temperature, and humidity are checked against local conditions.',
    visual: (
      <div className="flex flex-col items-center gap-3">
        {/* Weather illustration */}
        <svg className="w-16 h-10" viewBox="0 0 64 40" fill="none">
          <motion.g animate={{ y: [0, -1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <circle cx="44" cy="16" r="8" fill="rgba(251,191,36,0.25)" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
            <circle cx="44" cy="16" r="4" fill="rgba(251,191,36,0.4)" />
          </motion.g>
          <motion.path d="M10 28 Q16 20 24 24 Q30 18 38 24 Q44 20 50 26 Q54 24 58 28" fill="rgba(148,163,184,0.2)" stroke="rgba(148,163,184,0.3)" strokeWidth="0.8" />
          <path d="M12 28 Q18 22 26 26 Q32 20 40 26 Q46 22 52 28" stroke="rgba(148,163,184,0.25)" strokeWidth="0.8" fill="none" />
        </svg>
        {/* Chips */}
        <div className="flex items-center gap-2 text-[10px] text-[#6B6B6B]">
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-[#E5E0D8]">
            <Thermometer className="w-3 h-3 text-amber-500" /> 18°C
          </span>
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-[#E5E0D8]">
            <Droplets className="w-3 h-3 text-blue-500" /> 12mm
          </span>
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-[#E5E0D8]">
            <CloudSun className="w-3 h-3 text-sky-500" /> 72%
          </span>
        </div>
      </div>
    ),
    meta: 'Light rain expected',
  },
  {
    icon: Sprout,
    title: 'Crop Stage',
    description: 'Planting date helps identify the current potato growth stage.',
    visual: (
      <div className="flex flex-col items-center gap-3">
        {/* Potato plant icon */}
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
          <motion.path
            d="M20 36 L20 20 M20 20 Q16 14 12 12 M20 20 Q24 14 28 12 M20 20 Q16 24 14 28"
            stroke="rgba(34,163,79,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none"
            animate={{ pathLength: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="12" cy="12" r="3" fill="rgba(34,163,79,0.2)" />
          <circle cx="28" cy="12" r="3" fill="rgba(34,163,79,0.2)" />
          <circle cx="20" cy="20" r="4" fill="rgba(34,163,79,0.15)" stroke="rgba(34,163,79,0.25)" strokeWidth="0.8" />
        </svg>
        {/* Timeline */}
        <div className="flex items-center gap-0.5 w-full max-w-[160px]">
          {['P','E','V','T','B','M'].map((stage, i) => (
            <div key={stage} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-[5px] rounded-full ${i === 2 ? 'bg-brand-green' : 'bg-[#E5E0D8]'}`} />
              <span className={`text-[9px] font-bold ${i === 2 ? 'text-brand-green' : 'text-[#6B6B6B]'}`}
                style={i === 2 ? { textShadow: '0 0 8px rgba(34,163,79,0.2)' } : undefined}
              >{stage}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    meta: 'Vegetative — high water demand',
  },
];

export default function SatelliteFlow() {
  return (
    <section className="max-w-6xl mx-auto px-6">
      <SectionTitle
        title="From raw field signals to a"
        italicText="clear farmer action."
        subtitle=""
      />
      <div className="bg-white border border-[#ECE8E1] rounded-3xl p-8 md:p-12 shadow-[0_12px_40px_rgba(23,23,23,0.02)]">
        {/* Section header */}
        <div className="text-center space-y-2 mb-10">
          
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#171717] tracking-tight">
            
            <span className="italic text-[#16a34a]/70"></span>
          </h2>
          <p className="text-xs md:text-sm text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
            Farm360 combines satellite imagery, weather, and crop stage context to explain what is happening and what the farmer should do next.
          </p>
        </div>

          {/* Desktop: horizontal connected flow */}
          <div className="hidden md:flex flex-col items-center gap-5">
          {/* Row: steps 1-3 with CSS Grid */}
          <div className="grid grid-cols-3 gap-5 w-full">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="bg-[#FAF9F6] rounded-2xl border border-[#ECE8E1] p-6 flex flex-col h-[350px]">
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8E1] flex items-center justify-center text-[#6B6B6B] mb-4">
                    <step.icon className="w-4 h-4" />
                  </div>
                  {/* Title */}
                  <h4 className="text-sm font-bold text-[#171717] mb-1.5">{step.title}</h4>
                  {/* Description (2 lines) */}
                  <p className="text-[11px] text-[#6B6B6B] leading-relaxed line-clamp-2 mb-5">{step.description}</p>
                  {/* Visual (flex-1 centered) */}
                  <div className="flex-1 flex items-center justify-center">{step.visual}</div>
                  {/* Bottom metadata */}
                  <p className="text-[9px] text-[#6B6B6B] font-medium text-center mt-4 pt-3 border-t border-[#ECE8E1]/60">{step.meta}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Step 4: AI Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-[#ECE8E1] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8E1] flex items-center justify-center text-[#6B6B6B]">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#171717]">AI Analysis</h4>
                  <p className="text-[10px] text-[#6B6B6B]">Signals are compared to stress patterns and risk thresholds.</p>
                </div>
              </div>
              {/* Risk meter mini visual */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[9px] text-[#6B6B6B] font-semibold px-0.5">
                  <span>Low</span>
                  <span className="text-amber-600">Moderate</span>
                  <span>High</span>
                </div>
                <div className="w-full h-2 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200 rounded-full border border-[#ECE8E1] relative overflow-hidden">
                  <motion.div
                    initial={{ left: '0%' }}
                    whileInView={{ left: '42%' }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-amber-500 rounded-full shadow-sm"
                  />
                </div>
                <p className="text-[9px] text-amber-700 font-medium text-right">Moisture stress risk detected</p>
              </div>
            </div>
          </motion.div>

          {/* Step 5: Farmer Advisory (highlighted outcome) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-[#FAF9F6] to-white rounded-2xl p-6 border border-brand-green/20 shadow-[0_4px_16px_rgba(34,163,79,0.06)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#171717]">Farmer Advisory</h4>
                  <p className="text-[10px] text-[#6B6B6B]">The farmer receives a simple action, not raw data.</p>
                </div>
              </div>
              {/* Phone message preview */}
              <div className="bg-white border border-[#ECE8E1] rounded-xl p-3.5 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#ECE8E1]/60">
                  <div className="w-4 h-4 rounded-full bg-brand-green/20 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-brand-green">FP</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#171717]">FieldPulse Advisory</span>
                  <span className="ml-auto text-[8px] text-[#6B6B6B]">Now</span>
                </div>
                <p className="text-[11px] text-[#171717] leading-relaxed">
                  Inspect soil moisture within 24 hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile: vertical stacked steps */}
        <div className="flex md:hidden flex-col items-start gap-0 relative">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#E5E0D8]" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-12 pb-8 w-full"
            >
              {/* Timeline dot */}
              <div className="absolute left-[13px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#D4D0C8]" />
              <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#ECE8E1] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#ECE8E1] flex items-center justify-center text-[#6B6B6B] shrink-0">
                    <step.icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">{step.title}</h4>
                </div>
                <p className="text-[10px] text-[#6B6B6B] leading-relaxed">{step.description}</p>
                <div className="flex justify-center py-1">{step.visual}</div>
                <p className="text-[8px] text-[#6B6B6B] text-center pt-1 border-t border-[#ECE8E1]/60">{step.meta}</p>
              </div>
            </motion.div>
          ))}

          {/* Step 4 - AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative pl-12 pb-8 w-full"
          >
            <div className="absolute left-[13px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#D4D0C8]" />
            <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#ECE8E1] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ECE8E1] flex items-center justify-center text-[#6B6B6B] shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-[#171717]">AI Analysis</h4>
              </div>
              <p className="text-[10px] text-[#6B6B6B] leading-relaxed">Signals are compared to stress patterns and risk thresholds.</p>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[9px] text-[#6B6B6B] font-semibold px-0.5">
                  <span>Low</span>
                  <span className="text-amber-600">Moderate</span>
                  <span>High</span>
                </div>
                <div className="w-full h-2 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200 rounded-full border border-[#ECE8E1] relative overflow-hidden">
                  <motion.div
                    initial={{ left: '0%' }}
                    whileInView={{ left: '42%' }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-amber-500 rounded-full shadow-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 5 - Farmer Advisory (highlighted) */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative pl-12 w-full"
          >
            <div className="absolute left-[13px] top-1.5 w-3 h-3 rounded-full bg-brand-green border-2 border-brand-green/40" />
            <div className="bg-gradient-to-br from-[#FAF9F6] to-white rounded-2xl p-4 border border-brand-green/20 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                  <MessageSquareText className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-[#171717]">Farmer Advisory</h4>
              </div>
              <p className="text-[10px] text-[#6B6B6B] leading-relaxed">The farmer receives a simple action, not raw data.</p>
              <div className="bg-white border border-[#ECE8E1] rounded-xl p-3 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 pb-1 border-b border-[#ECE8E1]/60">
                  <div className="w-3.5 h-3.5 rounded-full bg-brand-green/20 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-brand-green">FP</span>
                  </div>
                  <span className="text-[8px] font-bold text-[#171717]">FieldPulse Advisory</span>
                </div>
                <p className="text-[10px] text-[#171717] leading-relaxed">Inspect soil moisture within 24 hours.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center text-xs text-[#6B6B6B] mt-8 font-medium"
        >
          No raw satellite jargon. Just clear field action.
        </motion.p>
      </div>
    </section>
  );
}
