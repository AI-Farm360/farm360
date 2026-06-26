'use client';

import { motion } from 'motion/react';
import { Grid3x3 } from 'lucide-react';

interface CellData {
  value: number;
  label: string;
}

interface SatelliteHealthVisualProps {
  cells?: CellData[][];
}

function getCellColor(value: number): string {
  if (value >= 0.7) return 'bg-emerald-400 border-emerald-500';
  if (value >= 0.5) return 'bg-emerald-300 border-emerald-400';
  if (value >= 0.35) return 'bg-amber-300 border-amber-400';
  if (value >= 0.2) return 'bg-amber-400 border-amber-500';
  return 'bg-rose-300 border-rose-400';
}

function getCellLabel(value: number): string {
  if (value >= 0.7) return 'Healthy';
  if (value >= 0.35) return 'Monitor';
  return 'Stress';
}

const defaultCells: CellData[][] = [
  [{ value: 0.82, label: 'A1' }, { value: 0.75, label: 'A2' }, { value: 0.68, label: 'A3' }, { value: 0.71, label: 'A4' }, { value: 0.79, label: 'A5' }],
  [{ value: 0.77, label: 'B1' }, { value: 0.65, label: 'B2' }, { value: 0.42, label: 'B3' }, { value: 0.58, label: 'B4' }, { value: 0.73, label: 'B5' }],
  [{ value: 0.72, label: 'C1' }, { value: 0.55, label: 'C2' }, { value: 0.38, label: 'C3' }, { value: 0.45, label: 'C4' }, { value: 0.69, label: 'C5' }],
  [{ value: 0.69, label: 'D1' }, { value: 0.61, label: 'D2' }, { value: 0.48, label: 'D3' }, { value: 0.52, label: 'D4' }, { value: 0.66, label: 'D5' }],
  [{ value: 0.74, label: 'E1' }, { value: 0.71, label: 'E2' }, { value: 0.63, label: 'E3' }, { value: 0.67, label: 'E4' }, { value: 0.76, label: 'E5' }],
];

const zoneCounts = (cells: CellData[][]) => {
  let healthy = 0, monitor = 0, stress = 0;
  for (const row of cells) {
    for (const cell of row) {
      if (cell.value >= 0.7) healthy++;
      else if (cell.value >= 0.35) monitor++;
      else stress++;
    }
  }
  return { healthy, monitor, stress, total: cells.length * (cells[0]?.length || 1) };
};

export default function SatelliteHealthVisual({ cells = defaultCells }: SatelliteHealthVisualProps) {
  const zones = zoneCounts(cells);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#ECE8E1] rounded-2xl p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-[#ECE8E1]">
        <Grid3x3 className="w-4 h-4 text-brand-green" />
        <div>
          <h3 className="text-xs font-bold text-[#171717]">Vegetation Health Map</h3>
          <p className="text-[10px] text-[#6B6B6B]">Field-wide NDVI stress zones</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-grid grid-cols-5 gap-1.5 mx-auto">
          {cells.map((row, ri) =>
            row.map((cell, ci) => (
              <motion.div
                key={`${ri}-${ci}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: (ri * row.length + ci) * 0.03 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex items-center justify-center text-[9px] font-bold text-white/90 ${getCellColor(cell.value)}`}
                title={`${cell.label}: ${(cell.value * 100).toFixed(0)}% - ${getCellLabel(cell.value)}`}
              >
                {(cell.value * 100).toFixed(0)}
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#ECE8E1] text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-500" />
          <span className="font-medium text-[#171717]">Healthy ({zones.healthy})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-300 border border-amber-400" />
          <span className="font-medium text-[#171717]">Monitor ({zones.monitor})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-300 border border-rose-400" />
          <span className="font-medium text-[#171717]">Stress ({zones.stress})</span>
        </div>
      </div>
    </motion.div>
  );
}
