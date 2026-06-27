import { motion } from 'motion/react';
import { Sparkles, Wifi, WifiOff } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import * as mock from '@/data/mockData';
import { riskTypeToTitle, riskTypeToTriggeredBy, scoreToSeverity } from '@/lib/api';
import AdvisoryPriorityVisual from '@/components/AdvisoryPriorityVisual';
import SatelliteHealthVisual from '@/components/SatelliteHealthVisual';
import AIReasoningFlow from '@/components/AIReasoningFlow';
import CropStageTimeline from '@/components/CropStageTimeline';
import DataReliabilityVisual from '@/components/DataReliabilityVisual';
import FieldMapVisual from '@/components/FieldMapVisual';

export default function OverviewPage() {
  const { activeField, farmerProfile, advisory, monitoring, isBackendLive } = useDashboard();
  const lat = parseFloat(farmerProfile.latitude || '-0.2643');
  const lng = parseFloat(farmerProfile.longitude || '36.3789');

  // Derive advisory display values — live if available, else mock
  const title = advisory ? riskTypeToTitle(advisory.risk_type) : mock.advisory.title;
  const severity = advisory ? scoreToSeverity(advisory.risk_score) : mock.advisory.severity;
  const recommendation = advisory ? advisory.recommended_action : mock.advisory.recommendation;
  const confidence = advisory ? Math.round(advisory.confidence * 100) : mock.advisory.confidence;
  const triggeredBy = advisory
    ? riskTypeToTriggeredBy(advisory.risk_type, advisory.inputs.satellite, advisory.risk_score)
    : mock.advisory.triggeredBy;

  const growthStage = advisory?.growth_stage || monitoring?.field_id ? (advisory?.growth_stage ?? 'Vegetative') : 'Vegetative';

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Backend status banner */}
      <div className={`border rounded-xl px-5 py-3 flex items-center gap-2.5 text-xs ${
        isBackendLive
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-[#FAF9F6] border-[#ECE8E1] text-[#6B6B6B]'
      }`}>
        {isBackendLive
          ? <Wifi className="w-3.5 h-3.5 shrink-0" />
          : <WifiOff className="w-3.5 h-3.5 shrink-0" />}
        <span className="italic">
          {isBackendLive
            ? 'Live analysis from your field — risk engine running on satellite + weather data.'
            : 'Demo analysis generated from your registered field details.'}
        </span>
        {isBackendLive && (
          <span className="ml-auto font-semibold not-italic flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live
          </span>
        )}
      </div>

      <AdvisoryPriorityVisual
        title={title}
        severity={severity}
        recommendation={recommendation}
        confidence={confidence}
        triggeredBy={triggeredBy}
      />

      <SatelliteHealthVisual />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIReasoningFlow />
        <CropStageTimeline
          currentStage={growthStage as 'Vegetative'}
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
