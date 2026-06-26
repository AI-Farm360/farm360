'use client';

import { motion } from 'motion/react';
import { CloudRain, Sprout, Droplets, AlertTriangle, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: CloudRain,
    label: 'Rainfall below average',
    detail: '40% less rain than usual for this period',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    icon: Sprout,
    label: 'Vegetative crop stage',
    detail: 'Potatoes in active growth, high water demand',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    icon: Droplets,
    label: 'Moisture index declining',
    detail: 'NDMI dropped from 0.45 to 0.38 this week',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
];

const conclusion = {
  icon: AlertTriangle,
  label: 'Moisture Stress Watch',
  detail: 'Medium risk — inspect field within 24 hours',
  color: 'text-amber-600 bg-amber-50 border-amber-200',
};

export default function WeatherAdvisoryFlow() {
  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xs font-bold text-[#171717]">Weather-to-Advisory Connection</h3>
          <p className="text-[10px] text-[#6B6B6B]">How weather data led to this advisory</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className={`flex items-center gap-3 p-3 rounded-xl border w-full max-w-md ${step.color}`}
              >
                <div className="p-1.5 bg-white/60 rounded-lg shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">{step.label}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{step.detail}</p>
                </div>
              </motion.div>
              {i < steps.length && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.15 + 0.2 }}
                  className="flex flex-col items-center py-1"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-[#6B6B6B]" />
                </motion.div>
              )}
            </div>
          );
        })}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className={`flex items-center gap-3 p-3 rounded-xl border w-full max-w-md ${conclusion.color}`}
        >
          <div className="p-1.5 bg-white/60 rounded-lg shrink-0">
            <conclusion.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{conclusion.label}</p>
            <p className="text-[10px] opacity-75 mt-0.5">{conclusion.detail}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
