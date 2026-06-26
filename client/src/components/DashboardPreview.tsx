'use client';

import { motion } from 'motion/react';
import { Bot, Eye, CloudRain, Thermometer, Droplets, Sparkles, ArrowDown, Brain } from 'lucide-react';

export default function DashboardPreview() {
  const metrics = [
    { label: 'NDVI Vegetation Vigor', value: '0.72', desc: 'Optimal density', icon: Eye, color: 'text-brand-green' },
    { label: 'NDMI Soil Moisture', value: '0.41', desc: 'Mild decline', icon: Droplets, color: 'text-indigo-500' },
    { label: '24h Rainfall', value: '12mm', desc: 'Light precipitation', icon: CloudRain, color: 'text-sky-500' },
    { label: 'Temperature', value: '18°C', desc: 'Cool mountain air', icon: Thermometer, color: 'text-amber-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(23,23,23,0.03)] space-y-8 max-w-4xl mx-auto"
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-sans font-bold text-base text-brand-text">Nyandarua Field #1</h4>
              <span className="bg-brand-light-green/60 text-brand-green font-semibold text-[10px] px-2 py-0.5 rounded-full border border-brand-green/20">
                Vegetative Phase
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">Farmer: <span className="font-medium text-brand-text">John Mwangi</span> • Potatoes (Shangi)</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">Risk Status</span>
            <span className="text-sm font-semibold text-brand-green">24% - Low Risk</span>
          </div>
          <div className="h-8 w-px bg-brand-border hidden sm:block"></div>
          <div className="text-right">
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">Field Status</span>
            <span className="text-sm font-bold text-brand-green bg-brand-light-green/30 px-3 py-1 rounded-full border border-brand-green/10">Healthy</span>
          </div>
        </div>
      </div>

      {/* AI Reasoning Flow */}
      <div className="bg-[#FCFBF9] border border-brand-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-brand-muted" />
          <span className="text-[10px] font-bold text-brand-text uppercase tracking-wider">AI Reasoning</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-semibold">NDMI 0.41</span>
          <ArrowDown className="w-3 h-3 text-brand-muted -rotate-90" />
          <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg font-semibold">Rain -40%</span>
          <ArrowDown className="w-3 h-3 text-brand-muted -rotate-90" />
          <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-semibold">Vegetative Stage</span>
          <ArrowDown className="w-3 h-3 text-brand-muted -rotate-90" />
          <span className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold">Moisture Stress Watch</span>
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-border/60 flex flex-col justify-between hover:border-brand-border hover:bg-brand-bg transition-colors duration-200">
              <div className="flex items-center justify-between gap-1.5 text-brand-muted">
                <span className="text-[10px] uppercase font-bold tracking-wider leading-tight">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="mt-3">
                <span className="font-serif text-2xl font-bold text-brand-text">{m.value}</span>
                <span className="text-[10px] text-brand-muted block mt-0.5">{m.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Recommended Action */}
      <div className="p-6 rounded-2xl bg-[#FCFBF9] border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-muted" />
            <span className="text-xs font-semibold text-brand-text">Today&apos;s Recommended Action</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Medium Priority</span>
            <span className="text-brand-muted font-semibold">•</span>
            <span className="text-brand-green font-semibold font-mono text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              91% Confidence
            </span>
          </div>
        </div>
        <p className="font-serif text-base text-brand-text leading-relaxed pt-4 font-light italic">
          &ldquo;Moisture levels are slightly declining. Inspect soil moisture within 24 hours and irrigate if needed.&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
