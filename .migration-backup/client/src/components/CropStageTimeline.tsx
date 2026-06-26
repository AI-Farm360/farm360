'use client';

import { motion } from 'motion/react';
import { Sprout, Leaf, Flower2, Apple, Wheat, CheckCircle2 } from 'lucide-react';

interface Stage {
  key: string;
  label: string;
  icon: typeof Sprout;
  days: string;
}

interface CropStageTimelineProps {
  stages?: Stage[];
  currentStage: string;
  plantingDate: string;
}

const defaultStages: Stage[] = [
  { key: 'Planting', label: 'Planting', icon: Sprout, days: 'Day 0' },
  { key: 'Emergence', label: 'Emergence', icon: Leaf, days: 'Day 15-25' },
  { key: 'Vegetative', label: 'Vegetative', icon: Leaf, days: 'Day 30-55' },
  { key: 'Tuber Initiation', label: 'Tuber Init.', icon: Flower2, days: 'Day 55-70' },
  { key: 'Bulking', label: 'Bulking', icon: Apple, days: 'Day 70-95' },
  { key: 'Maturity', label: 'Maturity', icon: Wheat, days: 'Day 95-120' },
];

export default function CropStageTimeline({ stages = defaultStages, currentStage = 'Vegetative', plantingDate = '2026-05-12' }: CropStageTimelineProps) {
  const currentIdx = stages.findIndex(s => s.key === currentStage);
  const progress = currentIdx >= 0 ? ((currentIdx + 1) / stages.length) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#ECE8E1]">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-brand-green" />
          <div>
            <h3 className="text-xs font-bold text-[#171717]">Crop Growth Stage</h3>
            <p className="text-[10px] text-[#6B6B6B]">Planted {plantingDate}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-brand-green bg-brand-light-green/40 px-2.5 py-1 rounded-full border border-brand-green/20">
          {currentStage}
        </span>
      </div>

      <div className="relative">
        <div className="w-full bg-[#FAF9F6] rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-brand-green/60 via-brand-green to-brand-green/80"
          />
        </div>

        <div className="grid grid-cols-6 gap-1 mt-4">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            const isCurrent = stage.key === currentStage;
            const isPast = currentIdx >= i;
            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`text-center space-y-1.5 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-brand-light-green/40 border border-brand-green/20 shadow-xs'
                    : isPast
                    ? 'bg-[#FAF9F6]'
                    : 'opacity-40'
                }`}
              >
                <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center ${
                  isCurrent ? 'bg-brand-green text-white' : isPast ? 'bg-[#E8E4DE] text-[#6B6B6B]' : 'bg-[#F5F3F0] text-[#6B6B6B]'
                }`}>
                  {isPast && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-[8px] font-bold block leading-tight ${isCurrent ? 'text-brand-green' : 'text-[#6B6B6B]'}`}>
                  {stage.label}
                </span>
                <span className="text-[7px] text-[#6B6B6B] block">{stage.days}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
