'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

const FarmMap = dynamic(() => import('@/src/components/FarmMap'), { ssr: false });

interface FieldMapVisualProps {
  latitude: number;
  longitude: number;
  fieldName: string;
  readOnly?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  compact?: boolean;
}

export default function FieldMapVisual({ latitude, longitude, fieldName, readOnly = true, onLocationChange, compact = false }: FieldMapVisualProps) {
  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl overflow-hidden shadow-xs">
      <div className="px-4 py-3 border-b border-[#ECE8E1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-green" />
          <span className="text-xs font-bold text-[#171717]">{fieldName}</span>
        </div>
        <span className="text-[9px] font-bold text-brand-green bg-brand-light-green/40 px-2 py-0.5 rounded-full border border-brand-green/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
          Monitoring Active
        </span>
      </div>
      <FarmMap
        latitude={latitude}
        longitude={longitude}
        onLocationChange={onLocationChange || (() => {})}
        readOnly={readOnly}
      />
    </div>
  );
}
