'use client';

import { motion } from 'motion/react';
import { AlertTriangle, Clock, Droplets, Sparkles } from 'lucide-react';

interface AdvisoryPriorityVisualProps {
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  recommendation: string;
  confidence: number;
  triggeredBy: string;
}

const severityConfig = {
  Low: { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Low Risk', iconColor: 'text-emerald-600' },
  Medium: { color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Medium Risk', iconColor: 'text-amber-600' },
  High: { color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'High Risk', iconColor: 'text-rose-600' },
};

export default function AdvisoryPriorityVisual({ title, severity, recommendation, confidence, triggeredBy }: AdvisoryPriorityVisualProps) {
  const cfg = severityConfig[severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#ECE8E1] rounded-2xl overflow-hidden shadow-xs"
    >
      <div className="flex items-stretch">
        <div className={`w-2 shrink-0 ${cfg.color}`} />
        <div className="flex-1 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${cfg.bg} rounded-xl`}>
                <AlertTriangle className={`w-5 h-5 ${cfg.iconColor}`} />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
                <h3 className="text-base font-bold text-[#171717] mt-0.5">{title}</h3>
              </div>
            </div>
            <div className={`${cfg.bg} border ${cfg.border} rounded-xl px-3 py-2 text-center shrink-0`}>
              <span className={`text-lg font-bold ${cfg.text} block leading-none`}>{confidence}%</span>
              <span className={`text-[9px] font-semibold uppercase tracking-wider ${cfg.text}`}>Confidence</span>
            </div>
          </div>

          <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 space-y-3`}>
            <div className="flex items-start gap-3">
              <Droplets className={`w-4 h-4 ${cfg.iconColor} shrink-0 mt-0.5`} />
              <div>
                <span className="text-xs font-bold text-[#171717]">Recommended Action</span>
                <p className="text-sm text-[#171717]/80 mt-1 leading-relaxed">{recommendation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#6B6B6B] pt-2 border-t border-[#ECE8E1]">
              <Clock className="w-3 h-3" />
              <span className="font-semibold">Act within 24 hours</span>
              <span className="mx-1">·</span>
              <Sparkles className="w-3 h-3 text-brand-green" />
              <span>Trigger: {triggeredBy}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
