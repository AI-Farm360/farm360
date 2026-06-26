'use client';

import { MapPin, Tractor, Satellite, CheckCircle2 } from 'lucide-react';

interface SatellitePreviewCardProps {
  county: string;
  variety: string;
  farmSize: number;
}

export default function SatellitePreviewCard({ county, variety, farmSize }: SatellitePreviewCardProps) {
  if (!county) return null;

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 space-y-4 shadow-xs">
      <h3 className="text-xs font-bold text-[#171717] flex items-center gap-2">
        <Satellite className="w-3.5 h-3.5 text-brand-green" />
        Field Preview
      </h3>

      <div className="flex items-center gap-3 pb-3 border-b border-[#ECE8E1]">
        <div className="w-10 h-10 rounded-xl bg-brand-light-green/40 text-brand-green flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#171717]">{county}</p>
          <p className="text-[10px] text-[#6B6B6B]">Rift Valley, Kenya</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FAF9F6] rounded-xl p-3 space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#6B6B6B] flex items-center gap-1">
            <Tractor className="w-3 h-3" /> Crop
          </span>
          <span className="text-xs font-bold text-[#171717]">{variety || '—'} Potato</span>
        </div>
        <div className="bg-[#FAF9F6] rounded-xl p-3 space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#6B6B6B]">Area</span>
          <span className="text-xs font-bold text-[#171717]">{farmSize || '—'} Acres</span>
        </div>
      </div>

      <div className="bg-brand-light-green/20 border border-brand-green/15 rounded-xl px-4 py-3 flex items-center gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
        <div>
          <p className="text-[11px] font-bold text-brand-green">Monitoring Ready</p>
          <p className="text-[9px] text-brand-green/70">Satellite bounding box calibrated</p>
        </div>
        <span className="ml-auto w-2 h-2 bg-brand-green rounded-full animate-pulse shrink-0" />
      </div>
    </div>
  );
}
