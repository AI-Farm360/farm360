import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import * as mock from '@/data/mockData';
import AdvisoryPriorityVisual from '@/components/AdvisoryPriorityVisual';
import SatelliteHealthVisual from '@/components/SatelliteHealthVisual';
import AIReasoningFlow from '@/components/AIReasoningFlow';
import CropStageTimeline from '@/components/CropStageTimeline';
import DataReliabilityVisual from '@/components/DataReliabilityVisual';
import FieldMapVisual from '@/components/FieldMapVisual';

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

      <SatelliteHealthVisual />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIReasoningFlow />
        <CropStageTimeline
          currentStage="Vegetative"
          plantingDate={activeField.plantingDate}
        />
      </div>

      <FieldMapVisual
        latitude={lat}
        longitude={lng}
        fieldName={activeField.name}
        readOnly
      />

      <DataReliabilityVisual />
    </motion.div>
  );
}
