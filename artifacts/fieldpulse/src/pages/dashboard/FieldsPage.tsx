import { motion } from 'motion/react';
import { Plus, Tractor } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import CropStageTimeline from '@/components/CropStageTimeline';
import FieldMapVisual from '@/components/FieldMapVisual';

export default function FieldsPage() {
  const { fields, selectedFieldId, setSelectedFieldId, setShowAddField, activeField, farmerProfile } = useDashboard();
  const lat = parseFloat(farmerProfile.latitude || '-0.2643');
  const lng = parseFloat(farmerProfile.longitude || '36.3789');

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-sans font-bold text-sm text-[#171717]">Tracked Farm Fields</h2>
          <p className="text-xs text-[#6B6B6B]">Select which potato plot bounding box is active on your workspace.</p>
        </div>
        <button onClick={() => setShowAddField(true)} className="bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs">
          <Plus className="w-3.5 h-3.5" /><span>Register New</span>
        </button>
      </div>

      <FieldMapVisual
        latitude={lat}
        longitude={lng}
        fieldName={activeField.name}
        readOnly
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => {
              const isActive = f.id === selectedFieldId;
              return (
                <div key={f.id} className={`bg-white border rounded-2xl p-5 space-y-4 shadow-xs transition-all duration-150 ${isActive ? 'border-brand-green ring-2 ring-brand-green/10' : 'border-[#ECE8E1]'}`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#171717]">{f.name}</h3>
                        {isActive && <span className="bg-brand-light-green text-brand-green text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-green/25">Active</span>}
                      </div>
                      <p className="text-xs text-[#6B6B6B]">{f.county} County &middot; {f.subCounty} Sub-county</p>
                    </div>
                    <div className="p-2 bg-[#FAF9F6] border border-[#ECE8E1] rounded-xl text-[#171717]"><Tractor className="w-4 h-4" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#ECE8E1] text-[11px]">
                    <div className="space-y-0.5"><span className="text-[#6B6B6B] block uppercase tracking-wide text-[9px]">Variety</span><span className="font-bold">{f.variety}</span></div>
                    <div className="space-y-0.5"><span className="text-[#6B6B6B] block uppercase tracking-wide text-[9px]">Acreage</span><span className="font-bold">{f.farmSize} Ac</span></div>
                    <div className="space-y-0.5"><span className="text-[#6B6B6B] block uppercase tracking-wide text-[9px]">Risk Score</span><span className={`font-bold ${f.riskScore > 30 ? 'text-amber-600' : 'text-brand-green'}`}>{f.riskScore}%</span></div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-[#6B6B6B]">Planting date: {f.plantingDate}</span>
                    {!isActive && <button onClick={() => setSelectedFieldId(f.id)} className="bg-white hover:bg-[#FAF9F6] border border-[#ECE8E1] text-[#171717] text-xs font-bold py-1 px-3 rounded-lg transition-colors cursor-pointer">Activate</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <CropStageTimeline
            currentStage="Vegetative"
            plantingDate={activeField.plantingDate}
          />
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
                <span className="text-[#6B6B6B]">Sub-county</span>
                <span className="font-semibold text-[#171717]">{activeField.subCounty}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#FAF9F6]">
                <span className="text-[#6B6B6B]">Ward</span>
                <span className="font-semibold text-[#171717]">{activeField.ward}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#FAF9F6]">
                <span className="text-[#6B6B6B]">Variety</span>
                <span className="font-semibold text-[#171717]">{activeField.variety}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#6B6B6B]">Acreage</span>
                <span className="font-semibold text-[#171717]">{activeField.farmSize} Acres</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
