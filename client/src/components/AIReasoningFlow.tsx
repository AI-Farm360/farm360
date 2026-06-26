'use client';

import { motion } from 'motion/react';
import { Satellite, CloudSun, Sprout, Brain, ArrowDown, Target } from 'lucide-react';

interface ReasonStep {
  icon: typeof Satellite;
  label: string;
  detail: string;
  status: 'good' | 'warning' | 'info';
}

interface AIReasoningFlowProps {
  steps?: ReasonStep[];
  conclusion?: string;
  action?: string;
}

const statusStyles = {
  good: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', dot: 'bg-emerald-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', dot: 'bg-amber-500' },
  info: { bg: 'bg-sky-50', border: 'border-sky-200', icon: 'text-sky-600', dot: 'bg-sky-500' },
};

const defaultSteps: ReasonStep[] = [
  { icon: Satellite, label: 'Satellite Observation', detail: 'NDMI dropped below 0.45', status: 'warning' },
  { icon: CloudSun, label: 'Weather Pattern', detail: 'Rainfall 40% below average', status: 'warning' },
  { icon: Sprout, label: 'Crop Stage', detail: 'Vegetative — moisture sensitive', status: 'info' },
];

export default function AIReasoningFlow({ steps = defaultSteps, conclusion = 'Possible moisture stress detected', action = 'Inspect soil moisture within 24 hours. If irrigation is available, water the affected section and monitor over the next three days.' }: AIReasoningFlowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <Brain className="w-4 h-4 text-brand-green" />
        <div>
          <h3 className="text-xs font-bold text-[#171717]">AI Reasoning Flow</h3>
          <p className="text-[10px] text-[#6B6B6B]">How we arrived at this recommendation</p>
        </div>
      </div>

      <div className="space-y-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const s = statusStyles[step.status];
          const isLast = i === steps.length - 1;
          return (
            <div key={step.label} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center w-8 shrink-0">
                <div className={`w-8 h-8 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.icon}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-[#ECE8E1] to-transparent my-1" />}
              </div>
              <div className={`pb-5 ${isLast ? '' : ''} flex-1 min-w-0`}>
                <div className={`${s.bg} border ${s.border} rounded-xl p-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">{step.label}</span>
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  </div>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5">{step.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-center"
      >
        <div className="bg-[#171717] text-white rounded-xl px-4 py-2 flex items-center gap-2 text-[11px] font-bold">
          <Brain className="w-4 h-4 text-brand-green" />
          AI Analysis Complete
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-brand-light-green/20 border border-brand-green/20 rounded-xl p-4 space-y-2"
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-green" />
          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Conclusion</span>
        </div>
        <p className="text-sm font-bold text-[#171717]">{conclusion}</p>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">{action}</p>
      </motion.div>
    </motion.div>
  );
}
