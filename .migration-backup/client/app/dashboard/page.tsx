'use client';

import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { useDashboard } from '@/src/contexts/DashboardContext';
import * as mock from '@/src/data/mockData';
import AdvisoryPriorityVisual from '@/src/components/AdvisoryPriorityVisual';
import SatelliteHealthVisual from '@/src/components/SatelliteHealthVisual';
import AIReasoningFlow from '@/src/components/AIReasoningFlow';
import CropStageTimeline from '@/src/components/CropStageTimeline';
import DataReliabilityVisual from '@/src/components/DataReliabilityVisual';

const FieldMapVisual = dynamic(() => import('@/src/components/FieldMapVisual'), { ssr: false });

export default function OverviewPage() {
  const { activeField, farmerProfile } = useDashboard();
  const lat = parseFloat(farmerProfile.latitude || '-0.2643');
  const lng = parseFloat(farmerProfile.longitude || '36.3789');

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-[#FAF9F6] border border-[#ECE8E1] rounded-xl px-5 py-3 flex items-center gap-2.5 text-xs text-[#6B6B6B]">
        <Sparkles className="w-3.5 h-3.5 text-brand-green shrink-0" />
        <span className="italic">Demo analysis generated from your registered field details.</span>
      </div>

      <AdvisoryPriorityVisual
        title={mock.advisory.title}
        severity={mock.advisory.severity}
        recommendation={mock.advisory.recommendation}
        confidence={mock.advisory.confidence}
        triggeredBy={mock.advisory.triggeredBy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <FieldMapVisual
            latitude={lat}
            longitude={lng}
            fieldName={activeField.name}
            readOnly
          />
          <SatelliteHealthVisual />
          <AIReasoningFlow />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <CropStageTimeline
            currentStage="Vegetative"
            plantingDate={activeField.plantingDate}
          />
          <DataReliabilityVisual />
          <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#171717]">Field Profile</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#FAF9F6]">
                <span className="text-[#6B6B6B]">Farmer</span>
                <span className="font-semibold text-[#171717]">{farmerProfile.name}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#FAF9F6]">
                <span className="text-[#6B6B6B]">County</span>
                <span className="font-semibold text-[#171717]">{activeField.county}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#FAF9F6]">
                <span className="text-[#6B6B6B]">Variety</span>
                <span className="font-semibold text-[#171717]">{activeField.variety}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#FAF9F6]">
                <span className="text-[#6B6B6B]">Acreage</span>
                <span className="font-semibold text-[#171717]">{activeField.farmSize} Acres</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#6B6B6B]">Status</span>
                <span className="font-bold text-brand-green bg-brand-light-green/40 px-2.5 py-0.5 rounded-full border border-brand-green/20 text-[10px]">{activeField.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
